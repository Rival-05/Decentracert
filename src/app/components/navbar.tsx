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
    <div className="flex w-full items-center justify-between">
      <Link
        href="/"
        className="flex items-center text-xl font-semibold tracking-tighter"
      >
        <Image src="/logo.svg" alt="Logo" width={80} height={80} />
        <span>Decentracert</span>
      </Link>
      <div className="flex items-center gap-10">
        {Links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="text-sm font-medium tracking-wider text-neutral-400 transition duration-300 hover:text-neutral-50"
          >
            {link.title}
          </Link>
        ))}
        {pathname === "/" && (
          <a
            href="#steps"
            className="cursor-pointer rounded-lg bg-neutral-300 px-4 py-2 text-sm font-medium tracking-tight text-neutral-800 transition-all duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900"
          >
            Get Started
          </a>
        )}
      </div>
    </div>
  );
};
