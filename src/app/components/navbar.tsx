"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();
  const Links = [
    { title: "Issue", href: "/issue" },
    { title: "Verify", href: "/verify" },
  ];
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-2 py-2">
      {pathname === "/" ? (
        <div className="flex items-center text-base font-semibold tracking-tight sm:text-lg md:text-xl lg:text-2xl">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
          Decentracert
        </div>
      ) : (
        <Link
          href="/"
          className="flex items-center text-base font-semibold tracking-tight sm:text-lg md:text-xl lg:text-2xl"
        >
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
          Decentracert
        </Link>
      )}

      <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {Links.map((link, index) => {
          const isActive = pathname === link.href;
          if (isActive) {
            return (
              <span
                key={index}
                className="relative text-xs font-medium tracking-wide text-neutral-50 sm:text-sm md:text-base"
              >
                {link.title}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-neutral-50" />
              </span>
            );
          }
          return (
            <Link
              key={index}
              href={link.href}
              className="text-xs font-medium tracking-wide text-neutral-400 transition duration-300 hover:text-neutral-50 sm:text-sm md:text-base"
            >
              {link.title}
            </Link>
          );
        })}

        {pathname === "/" && (
          <Link
            href="#steps"
            aria-label="Get Started guide"
            className="cursor-pointer rounded-lg bg-neutral-300 px-3 py-1.5 text-xs font-medium tracking-wide text-neutral-800 transition-all duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900 sm:px-4 sm:py-2 md:text-sm"
          >
            <span className="sm:hidden">Guide</span>
            <span className="hidden sm:inline">Get Started</span>
          </Link>
        )}
      </div>
    </div>
  );
};
