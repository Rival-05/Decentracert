"use client";

import Image from "next/image";
import Link from "next/link";
import { ProfileMenu } from "@/components/common/ProfileMenu";
import { topNavActions } from "@/config/navigation";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          aria-label="Go to homepage"
        >
          <Image src="/logo.svg" alt="Logo" width={25} height={25} />
          <span className="text-foreground text-base font-normal tracking-wide sm:text-lg">
            credbind
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {topNavActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                aria-label={action.ariaLabel}
                className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
              >
                {action.label.desktop}
              </Link>
            ))}
          </div>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
