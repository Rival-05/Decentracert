"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { sileo } from "sileo";
import Link from "next/link";
import { useAuthDashboardRedirect } from "@/lib/dashboardRedirect";
import { Role } from "@/types/auth";

export default function Signupui() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole =
    searchParams.get("role") === "issuer" ? "issuer" : "holder";

  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const checkingSession = useAuthDashboardRedirect({
    replace: (href) => router.replace(href),
  });

  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    enrollment: "",
    orgName: "",
    domain: "",
    email: "",
    password: "",
  });

  const heading = useMemo(
    () => (role === "issuer" ? "Issuer Signup" : "Holder Signup"),
    [role],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        role === "issuer"
          ? "/api/auth/issuer/signup"
          : "/api/auth/holder/signup";
      const payload =
        role === "issuer"
          ? {
              orgName: form.orgName,
              email: form.email,
              domain: form.domain,
              password: form.password,
            }
          : {
              name: form.name,
              email: form.email,
              enrollment: form.enrollment,
              password: form.password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        sileo.error({ title: data.message || "Signup failed" });
        return;
      }

      sileo.success({
        title:
          role === "issuer"
            ? "Issuer account created"
            : "Account created successfully",
      });

      router.push(`/login?role=${role}`);
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="bg-background flex min-h-screen w-full items-center justify-center">
        <div className="flex items-center gap-2">
          <Spinner className="fill-foreground h-5 w-5" />
          <p className="text-muted-foreground text-sm">Checking session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen w-full pt-20">
      <Container>
        <main className="flex w-full max-w-md items-center justify-center py-8">
          <Card className="w-full rounded-2xl border shadow-sm">
            <CardHeader className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1">
                <Button
                  type="button"
                  variant={role === "holder" ? "outline" : "secondary"}
                  onClick={() => setRole("holder")}
                  className="cursor-pointer"
                >
                  Holder
                </Button>

                <Button
                  type="button"
                  variant={role === "issuer" ? "outline" : "secondary"}
                  onClick={() => setRole("issuer")}
                  className="cursor-pointer"
                >
                  Issuer
                </Button>
              </div>

              <CardTitle className="text-2xl">{heading}</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                {role === "issuer" ? (
                  <>
                    <Input
                      placeholder="College Name"
                      value={form.orgName}
                      onChange={(e) =>
                        setForm({ ...form, orgName: e.target.value })
                      }
                    />
                    <Input
                      placeholder="Domain (e.g. juetguna.in)"
                      value={form.domain}
                      onChange={(e) =>
                        setForm({ ...form, domain: e.target.value })
                      }
                    />
                  </>
                ) : (
                  <>
                    <Input
                      placeholder="Full Name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                    <Input
                      placeholder="University Enrollment"
                      value={form.enrollment}
                      onChange={(e) =>
                        setForm({ ...form, enrollment: e.target.value })
                      }
                    />
                  </>
                )}

                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Creating..." : "Create account"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-muted-foreground justify-center text-sm">
              <span>Already have an account?&nbsp;</span>
              <Link
                href={`/login?role=${role}`}
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </CardFooter>
          </Card>
        </main>
      </Container>
    </div>
  );
}
