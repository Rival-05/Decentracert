"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { VerifyCredentialLink } from "@/components/common/VerifyCredentialLink";
import { PageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch, getToken } from "@/lib/api";
import CaretDown from "@/components/svgs/caretdown";
import Copy from "@/components/svgs/copy";
import Tick from "@/components/svgs/tick";
import { sileo } from "sileo";
import {
  CREDENTIAL_TYPES,
  FORM_FIELDS,
  TOAST_MESSAGES,
} from "@/lib/constants/dashboard";
import { getMaskedCid, copyCidToClipboard } from "@/lib/utils/cid";
import { getIssuerStatusTone } from "@/lib/utils/status";
import type {
  IssuerUser,
  IssueForm,
  IssuedCredential,
  MeResponse,
  IssueResponse,
  IssueCredentialsResponse,
} from "@/types/dashboard";

const initialForm: IssueForm = {
  walletId: "",
  type: "",
  title: "",
  program: "",
  department: "",
  cgpa: "",
  graduationYear: "",
  expiresAt: "",
  additionalRemarks: "",
};

const REQUIRED_FIELDS: (keyof IssueForm)[] = [
  "walletId",
  "type",
  "title",
  "program",
  "department",
  "cgpa",
  "graduationYear",
];

export default function IssuerDashboardPage() {
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [issuer, setIssuer] = useState<IssuerUser | null>(null);

  const [form, setForm] = useState(initialForm);

  const [issuedResult, setIssuedResult] = useState<IssuedCredential | null>(
    null,
  );

  const [typeOpen, setTypeOpen] = useState(false);

  const [issuedCredentials, setIssuedCredentials] = useState<
    IssuedCredential[]
  >([]);

  const [isLoadingCredentials, setIsLoadingCredentials] = useState(false);

  const [copiedCidId, setCopiedCidId] = useState<string | null>(null);

  const isApproved = issuer?.status === "APPROVED";

  const statusTone = getIssuerStatusTone(issuer?.status);

  const updateForm = <K extends keyof IssueForm>(
    key: K,
    value: IssueForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setIssuedResult(null);
  };

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/login?role=issuer");
  }, [router]);

  const loadIssuer = useCallback(
    async (showSpinner = false) => {
      const token = getToken();

      if (!token) {
        router.replace("/login?role=issuer");
        return;
      }

      try {
        showSpinner ? setIsRefreshing(true) : setIsPageLoading(true);

        const res = await apiFetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as MeResponse;

        if (!res.ok || !data.success || !data.user) {
          if (res.status === 503) {
            sileo.error({ title: TOAST_MESSAGES.DB_TIMEOUT });
            return;
          }

          handleUnauthorized();
          return;
        }

        if (data.role !== "ISSUER") {
          router.replace("/holder/dashboard");
          return;
        }

        setIssuer(data.user);
      } catch (error) {
        console.error(error);
        sileo.error({ title: TOAST_MESSAGES.ISSUER_PROFILE_LOAD_FAIL });
        handleUnauthorized();
      } finally {
        setIsPageLoading(false);
        setIsRefreshing(false);
      }
    },
    [handleUnauthorized, router],
  );

  const loadIssuedCredentials = useCallback(async () => {
    if (!getToken()) return;

    try {
      setIsLoadingCredentials(true);

      const res = await apiFetch("/api/credentials/issued", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as IssueCredentialsResponse;

      if (res.ok && data.success && data.credentials) {
        setIssuedCredentials(data.credentials);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingCredentials(false);
    }
  }, []);

  useEffect(() => {
    loadIssuer();
    loadIssuedCredentials();
  }, [loadIssuer, loadIssuedCredentials]);

  useEffect(() => {
    if (!copiedCidId) return;

    const timeoutId = setTimeout(() => {
      setCopiedCidId(null);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [copiedCidId]);

  const handleCopyCid = async (credentialId: string, cid: string) => {
    const success = await copyCidToClipboard(cid);
    if (success) {
      setCopiedCidId(credentialId);
      sileo.success({ title: TOAST_MESSAGES.CID_COPIED });
    } else {
      sileo.error({ title: TOAST_MESSAGES.CID_COPY_FAILED });
    }
  };

  const handleIssueSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIssuedResult(null);

    const hasEmptyField = REQUIRED_FIELDS.some((field) => !form[field].trim());

    if (hasEmptyField) {
      sileo.error({ title: TOAST_MESSAGES.FILL_REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form)
          .filter(([_, value]) => value.trim())
          .map(([key, value]) => [key, value.trim()]),
      );

      const res = await apiFetch("/api/credentials/issue", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as IssueResponse;

      if (!res.ok || !data.success || !data.credential) {
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }

        sileo.error({
          title: data.message || TOAST_MESSAGES.CREDENTIAL_ISSUED_FAIL,
        });

        return;
      }

      setIssuedResult(data.credential);

      resetForm();

      sileo.success({
        title: TOAST_MESSAGES.CREDENTIAL_ISSUED_SUCCESS,
      });

      loadIssuedCredentials();
    } catch (error) {
      console.error(error);

      sileo.error({
        title: TOAST_MESSAGES.REQUEST_FAILED,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPageLoading) {
    return <PageLoader message="Loading issuer workspace" />;
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <Card className="w-full rounded-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Issue New Credential</CardTitle>

              {issuer && (
                <div
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}
                >
                  {issuer.status}
                </div>
              )}
            </div>

            <CardDescription>
              Fill the holder wallet ID and credential details. Required fields
              are validated before submission.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!isApproved ? (
              <div className="bg-secondary text-secondary-foreground rounded-lg border p-4 text-sm">
                Your issuer account is not approved yet. Credential issuance is
                disabled until approval.
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit} className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {FORM_FIELDS.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium">
                        {field.label}
                      </label>

                      <Input
                        value={form[field.key]}
                        onChange={(e) => updateForm(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        autoComplete="off"
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Credential Type
                    </label>

                    <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="secondary"
                          className="w-full cursor-pointer justify-between"
                        >
                          {form.type || "Select credential type"}

                          <CaretDown />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search type..." />

                          <CommandList>
                            <CommandEmpty>No type found.</CommandEmpty>

                            <CommandGroup>
                              {CREDENTIAL_TYPES.map((type) => (
                                <CommandItem
                                  key={type}
                                  onSelect={() => {
                                    updateForm("type", type);

                                    setTypeOpen(false);
                                  }}
                                >
                                  {type}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Expires At (optional)
                    </label>

                    <DatePicker
                      value={
                        form.expiresAt ? new Date(form.expiresAt) : undefined
                      }
                      onChange={(date) =>
                        updateForm("expiresAt", date ? date.toISOString() : "")
                      }
                      className="data-[empty=true]:text-muted-foreground w-full cursor-pointer justify-between text-left font-normal"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium">
                      Additional Remarks (Optional)
                    </label>

                    <Input
                      value={form.additionalRemarks}
                      onChange={(e) =>
                        updateForm("additionalRemarks", e.target.value)
                      }
                      placeholder="Any additional context or note"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    {isSubmitting && <Spinner className="mr-2" />}

                    {isSubmitting
                      ? "Issuing credential..."
                      : "Issue Credential"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          {issuedResult && (
            <CardFooter className="border-t pt-4">
              <div className="bg-brand/10 w-full space-y-2 rounded-md border p-3 text-sm">
                <p className="font-semibold">Credential issued successfully</p>

                <p>
                  Credential ID:{" "}
                  <span className="font-medium">
                    {issuedResult.credentialId}
                  </span>
                </p>

                <p>
                  CID: <span className="font-medium">{issuedResult.cid}</span>
                </p>

                <p>
                  Status:{" "}
                  <span className="font-medium">{issuedResult.status}</span>
                </p>

                <VerifyCredentialLink cid={issuedResult.cid} />
              </div>
            </CardFooter>
          )}
        </Card>

        {issuedCredentials.length > 0 && (
          <div className="mt-8 flex w-full flex-col space-y-4">
            <h2 className="text-xl font-semibold">Issued Credentials</h2>

            <div className="space-y-3">
              {issuedCredentials.map((credential) => (
                <Card key={credential.id} className="rounded-xl">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">
                        {credential.title || credential.type}
                      </CardTitle>

                      <CardDescription className="text-xs">
                        ID: {credential.credentialId}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="text-sm">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {[
                        ["Type", credential.type],
                        ["Status", credential.status],
                        [
                          "Issued",
                          new Date(credential.issuedAt).toLocaleDateString(),
                        ],
                      ].map(([label, value]) => (
                        <div key={label} className="space-y-1">
                          <span className="text-muted-foreground text-xs">
                            {label}
                          </span>

                          <p className="font-medium">{value}</p>
                        </div>
                      ))}

                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs">
                          CID
                        </span>

                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">
                            {getMaskedCid(credential.cid)}
                          </p>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="relative shrink-0 cursor-pointer"
                            onClick={() =>
                              handleCopyCid(credential.id, credential.cid)
                            }
                            aria-label="Copy CID"
                          >
                            <span
                              className={`transition-all duration-200 ${
                                copiedCidId === credential.id
                                  ? "scale-100 opacity-0"
                                  : "scale-100 opacity-100"
                              }`}
                            >
                              <Copy />
                            </span>

                            <span
                              className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                                copiedCidId === credential.id
                                  ? "scale-100 opacity-100"
                                  : "scale-75 opacity-0"
                              }`}
                            >
                              <Tick />
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
