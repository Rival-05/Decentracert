"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { sileo } from "sileo";
import { VerifyResult, VerifiedDetailsCardProps } from "@/types/auth";

function getStatusTone(status?: string) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === "active") {
    return "text-emerald-600";
  }

  if (normalizedStatus === "revoked") {
    return "text-rose-600";
  }

  if (normalizedStatus === "expired") {
    return "text-amber-600";
  }

  return "text-muted-foreground";
}

function VerifiedDetailsCard({
  credentialData,
  lookupLabel,
  lookupTone,
}: VerifiedDetailsCardProps) {
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle className="text-2xl">Credential Details</CardTitle>
          <CardDescription>
            Verified credential information, issuer and holder identity, and
            academic record details.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-5 pt-0">
        <section className="space-y-2">
          <h3 className="text-foreground text-base font-semibold">
            Credential Overview
          </h3>
          <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">
                Credential ID
              </p>
              <p className="text-muted-foreground text-sm">
                {credentialData.credential?.credentialId ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Type</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.credential?.type ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Status</p>
              <p
                className={`text-sm font-medium tracking-wide uppercase ${getStatusTone(
                  credentialData.credential?.status,
                )}`}
              >
                {credentialData.credential?.status ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Issued On</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.credential?.issuedAt
                  ? new Date(
                      credentialData.credential.issuedAt,
                    ).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-foreground text-base font-semibold">
            Issuer and Holder Information
          </h3>
          <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Issuer</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.issuer?.orgName ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">
                Issuer Domain
              </p>
              <p className="text-muted-foreground text-sm">
                {credentialData.issuer?.domain ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">
                Issuer Approved
              </p>
              <p className="text-muted-foreground text-sm">
                {credentialData.issuer?.approved ? "Yes" : "No"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Holder Name</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.holder?.name ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Enrollment</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.holder?.enrollment ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Wallet ID</p>
              <p className="text-muted-foreground truncate text-sm">
                {credentialData.holder?.walletId ?? "-"}
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h3 className="text-foreground text-base font-semibold">
            Academic Information
          </h3>
          <div className="grid gap-4 px-4 pt-2 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Program</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.academic?.program || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">Department</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.academic?.department || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">CGPA</p>
              <p className="text-muted-foreground text-sm">
                {credentialData.academic?.cgpa || "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">
                Graduation Year
              </p>
              <p className="text-muted-foreground text-sm">
                {credentialData.academic?.graduationYear || "-"}
              </p>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}

export default function Verifyui() {
  const searchParams = useSearchParams();

  const [cid, setCid] = useState(searchParams.get("cid") ?? "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  const verifiedResult = result?.found ? result : null;

  const lookupLabel = useMemo(() => {
    if (!result?.summary) {
      return "Not checked";
    }

    return result.summary.trustworthy ? "Verified" : "Flagged";
  }, [result]);

  const lookupTone = useMemo(() => {
    if (!result?.summary) {
      return "bg-secondary text-secondary-foreground";
    }

    return result.summary.trustworthy
      ? "bg-brand/20 text-neutral-700"
      : "bg-destructive/10 text-destructive";
  }, [result]);

  const runVerify = useCallback(async (inputCid: string) => {
    const normalizedCid = inputCid.trim();

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/verify/${encodeURIComponent(normalizedCid)}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = (await res.json()) as VerifyResult;

      if (!res.ok || !data.success) {
        setResult(null);
        const message = data.message || "Verification failed.";
        setError(message);
        sileo.error({ title: message });
        return;
      }

      setResult(data);
      if (data.summary?.trustworthy) {
        sileo.success({ title: "Credential verified successfully" });
      } else {
        sileo.error({
          title: data.summary?.message || "Credential has verification issues",
        });
      }
    } catch (verifyError) {
      console.error("Verification request failed:", verifyError);
      setResult(null);
      const message = "Unable to complete verification right now.";
      setError(message);
      sileo.error({ title: message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialCid = searchParams.get("cid");
    if (initialCid) {
      setCid(initialCid);
      runVerify(initialCid);
    }
  }, [runVerify, searchParams]);

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full flex-col gap-4 py-3 sm:gap-5 sm:py-5 md:gap-6 md:py-6">
          <Card>
            <CardHeader className="gap-3 pb-3 sm:pb-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl">
                  Credential Verification
                </CardTitle>
                <CardDescription>
                  Validate credential trust by checking registry presence, IPFS
                  payload integrity, issuer approval, and lifecycle status.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-0">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  runVerify(cid);
                }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  value={cid}
                  onChange={(e) => setCid(e.target.value)}
                  placeholder="Enter credential CID"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer sm:w-44"
                >
                  {isLoading ? <Spinner className="mr-2" /> : null}
                  {isLoading ? "Verifying..." : "Verify Credential"}
                </Button>
              </form>

              {error ? (
                <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
                  {error}
                </div>
              ) : null}
            </CardContent>
          </Card>

          {verifiedResult ? (
            <VerifiedDetailsCard
              credentialData={verifiedResult}
              lookupLabel={lookupLabel}
              lookupTone={lookupTone}
            />
          ) : null}
        </main>
      </Container>
    </div>
  );
}
