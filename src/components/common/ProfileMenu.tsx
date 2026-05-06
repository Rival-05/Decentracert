"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { sileo } from "sileo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Copy from "@/components/svgs/copy";
import Tick from "@/components/svgs/tick";
import Logout from "@/components/svgs/logout";
import { apiFetch, getToken } from "@/lib/api";

type NavbarUser = {
  success: boolean;
  role?: "ISSUER" | "STUDENT";
  user?: {
    orgName?: string;
    name?: string;
    email?: string;
    domain?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    enrollment?: string;
    walletId?: string;
    createdAt?: string;
  };
};

export function ProfileMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<NavbarUser | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const token = getToken();
      if (!token) {
        if (active) setProfile(null);
        return;
      }

      try {
        const res = await apiFetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as NavbarUser;
        if (!res.ok || !data.success || !data.user) {
          if (active) setProfile(null);
          return;
        }

        if (active) {
          setProfile(data);
        }
      } catch {
        if (active) setProfile(null);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [pathname]);

  const displayName = useMemo(() => {
    if (!profile?.user) return "User";
    if (profile.role === "ISSUER") return profile.user.orgName || "Issuer";
    return profile.user.name || "Holder";
  }, [profile]);

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [displayName]);

  const isLoggedIn = Boolean(profile?.user);

  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false);
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isCopied]);

  async function handleCopyWallet() {
    const walletId = profile?.user?.walletId;
    if (!walletId) {
      sileo.error({ title: "Wallet ID not available" });
      return;
    }

    try {
      await navigator.clipboard.writeText(walletId);
      setIsCopied(true);
      sileo.success({ title: "Wallet ID copied" });
    } catch {
      sileo.error({ title: "Could not copy wallet ID" });
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setProfile(null);
    sileo.success({ title: "Logged out successfully" });
    router.push("/login");
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="space-y-1">
          <p className="text-base">{displayName}</p>
          <p className="text-muted-foreground text-sm">
            {profile?.user?.email ?? "-"}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {profile?.role === "ISSUER" ? (
          <>
            <DropdownMenuLabel>
              <span className="text-muted-foreground mr-1">Status</span>
              {profile.user?.status ?? "-"}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <span className="text-muted-foreground mr-1">Domain</span>
              {profile.user?.domain ?? "-"}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <span className="text-muted-foreground mr-1">Joined on</span>
              {profile.user?.createdAt
                ? new Date(profile.user.createdAt).toLocaleDateString()
                : "-"}
            </DropdownMenuLabel>
          </>
        ) : (
          <>
            <DropdownMenuLabel>
              <span className="text-muted-foreground mr-1">Enrollment </span>
              {profile?.user?.enrollment ?? "-"}
            </DropdownMenuLabel>
            <DropdownMenuLabel className="flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-muted-foreground mr-1">Wallet Id</span>
                <span className="truncate">
                  {profile?.user?.walletId ?? "-"}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="relative cursor-pointer"
                onClick={handleCopyWallet}
                aria-label="Copy wallet id"
              >
                <span
                  className={`transition-all duration-200 ${isCopied ? "scale-10 opacity-0" : "scale-100 opacity-100"}`}
                >
                  <Copy />
                </span>
                <span
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${isCopied ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
                >
                  <Tick />
                </span>
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              <span className="text-muted-foreground mr-1">Joined on</span>
              {profile?.user?.createdAt
                ? new Date(profile.user.createdAt).toLocaleDateString()
                : "-"}
            </DropdownMenuLabel>
          </>
        )}
        <DropdownMenuSeparator />

        <Button
          type="button"
          variant="destructive"
          className="flex w-full cursor-pointer justify-start gap-2"
          onClick={handleLogout}
          size="default"
        >
          <Logout />
          Log out
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
