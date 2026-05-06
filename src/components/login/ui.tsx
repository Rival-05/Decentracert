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

export default function Loginui() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole =
    searchParams.get("role") === "issuer" ? "issuer" : "holder";

  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const checkingSession = useAuthDashboardRedirect({
    replace: (href) => router.replace(href),
  });

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const heading = useMemo(
    () => (role === "issuer" ? "Issuer Login" : "Holder Login"),
    [role],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        role === "issuer" ? "/api/auth/issuer/login" : "/api/auth/holder/login";

      if (!form.email || !form.password) {
        sileo.error({ title: "Enter email and password" });
        return;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        sileo.error({ title: data.message || "Login failed" });
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role === "issuer" ? "ISSUER" : "STUDENT");

      sileo.success({ title: "Login successful" });

      setTimeout(() => {
        router.push(
          role === "issuer" ? "/issuer/dashboard" : "/holder/dashboard",
        );
      }, 600);
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

                <Button
                  type="submit"
                  disabled={loading}
                  variant="default"
                  className="cursor-pointer"
                >
                  {loading && <Spinner className="mr-2" />}
                  {loading ? "Logging in..." : "Log in"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="text-muted-foreground justify-center text-sm">
              <span>Don&apos;t have an account?&nbsp;</span>
              <Link
                href={`/signup?role=${role}`}
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </CardFooter>
          </Card>
        </main>
      </Container>
    </div>
  );
}
