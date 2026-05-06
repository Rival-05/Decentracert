"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { PageLoader } from "@/components/common/PageLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Copy from "@/components/svgs/copy";
import Eye from "@/components/svgs/eye";
import EyeSlash from "@/components/svgs/eyeslash";
import Tick from "@/components/svgs/tick";
import { apiFetch, getToken } from "@/lib/api";
import { sileo } from "sileo";
import { TOAST_MESSAGES } from "@/lib/constants/dashboard";
import { getMaskedCid, copyCidToClipboard } from "@/lib/utils/cid";
import { getHolderCredentialStatusClass } from "@/lib/utils/status";
import type {
  StudentUser,
  CredentialStatus,
  HolderCredentialItem,
  MineResponse,
} from "@/types/dashboard";

export default function HolderDashboardPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<HolderCredentialItem[]>([]);
  const [visibleCids, setVisibleCids] = useState<Record<string, boolean>>({});
  const [copiedCidId, setCopiedCidId] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.replace("/login?role=holder");
  }, [router]);

  const loadData = useCallback(async () => {
    const token = getToken();

    if (!token) {
      router.replace("/login?role=holder");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const meRes = await apiFetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });
      const meData = (await meRes.json()) as {
        success: boolean;
        role?: "ISSUER" | "STUDENT";
        message?: string;
      };

      if (!meRes.ok || !meData.success) {
        handleUnauthorized();
        return;
      }

      if (meData.role !== "STUDENT") {
        router.replace("/issuer/dashboard");
        return;
      }

      const mineRes = await apiFetch("/api/credentials/mine", {
        method: "GET",
        cache: "no-store",
      });
      const mineData = (await mineRes.json()) as MineResponse;

      if (!mineRes.ok || !mineData.success || !mineData.student) {
        if (mineRes.status === 401) {
          handleUnauthorized();
          return;
        }

        const message =
          mineData.message || TOAST_MESSAGES.HOLDER_CREDS_LOAD_FAIL;
        setError(message);
        sileo.error({ title: message });
        return;
      }

      setCredentials(mineData.credentials ?? []);
    } catch (loadError) {
      console.error("Holder dashboard load failed:", loadError);
      setError(TOAST_MESSAGES.HOLDER_CREDS_FETCH_FAIL);
      sileo.error({ title: TOAST_MESSAGES.HOLDER_CREDS_FETCH_FAIL });
    } finally {
      setIsLoading(false);
    }
  }, [handleUnauthorized, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!copiedCidId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopiedCidId(null);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copiedCidId]);

  const toggleCidVisibility = (credentialId: string) => {
    setVisibleCids((prev) => ({
      ...prev,
      [credentialId]: !prev[credentialId],
    }));
  };

  const handleCopyCid = async (credentialId: string, cid: string) => {
    const success = await copyCidToClipboard(cid);
    if (success) {
      setCopiedCidId(credentialId);
      sileo.success({ title: TOAST_MESSAGES.CID_COPIED });
    } else {
      sileo.error({ title: TOAST_MESSAGES.CID_COPY_FAILED });
    }
  };

  if (isLoading) {
    return <PageLoader message="Fetching your certificates..." />;
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full max-w-3xl flex-col gap-4 py-2 sm:gap-5 sm:py-4 md:gap-6 md:py-6">
          {error ? (
            <Card>
              <CardContent className="pt-1">
                <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-md border p-3 text-sm">
                  {error}
                </div>
              </CardContent>
            </Card>
          ) : null}

          <section className="grid gap-3">
            {credentials.length === 0 ? (
              <Card>
                <CardContent className="text-muted-foreground py-5 text-sm">
                  No certificates found. Stay tuned till your university issues
                  you some!
                </CardContent>
              </Card>
            ) : (
              credentials.map((credential) => (
                <Card key={credential.id} className="gap-3">
                  <CardHeader className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {credential.title || credential.type}
                      </CardTitle>
                      <CardDescription>{credential.type}</CardDescription>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getHolderCredentialStatusClass(credential.status)}`}
                    >
                      {credential.status}
                    </span>
                  </CardHeader>

                  <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-muted-foreground">Issued By</p>
                      <p className="text-foreground font-medium">
                        {credential.issuer.orgName}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issuer Domain</p>
                      <p className="text-foreground font-medium">
                        {credential.issuer.domain}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issued On</p>
                      <p className="text-foreground font-medium">
                        {new Date(credential.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">
                        {credential.expiresAt
                          ? new Date(credential.expiresAt).toLocaleDateString()
                          : "No expiry"}
                      </p>
                    </div>
                    <div className="sm:col-span-2 lg:col-span-4">
                      <p className="text-muted-foreground">CID</p>
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium ${visibleCids[credential.id] ? "break-all" : "truncate"}`}
                        >
                          {visibleCids[credential.id]
                            ? credential.cid
                            : getMaskedCid(credential.cid)}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="shrink-0 cursor-pointer"
                          onClick={() => toggleCidVisibility(credential.id)}
                          aria-label={
                            visibleCids[credential.id]
                              ? "Hide full CID"
                              : "Show full CID"
                          }
                        >
                          {visibleCids[credential.id] ? <EyeSlash /> : <Eye />}
                        </Button>
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
                            className={`transition-all duration-200 ${copiedCidId === credential.id ? "scale-10 opacity-0" : "scale-100 opacity-100"}`}
                          >
                            <Copy />
                          </span>
                          <span
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copiedCidId === credential.id ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                          >
                            <Tick />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        </main>
      </Container>
    </div>
  );
}
