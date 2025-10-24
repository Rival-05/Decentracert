import Link from "next/link";
import React from "react";

export const Hero = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center gap-6 py-12 text-center">
      <h1 className="max-w-3xl bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
        Secure, Verifiable Certificates — Anywhere.
      </h1>
      <p className="text-sm font-light text-neutral-400 sm:text-base md:text-lg">
        A smarter way to issue and check certificates — secure, simple, and
        trusted.
      </p>
      <Link href={"/issue"} className="mt-4">
        <button className="group flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium tracking-tight text-neutral-800 transition-colors duration-300 hover:bg-neutral-400 hover:text-neutral-900 sm:text-base md:px-4 md:py-2">
          Start issuing certificates
          <svg
            width="16"
            height="16"
            fill="none"
            className="transition-all duration-300 group-hover:pl-1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="#020515"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity=".8"
              strokeWidth="1.25"
              d="M8 4.75 11.25 8m0 0L8 11.25M11.25 8h-6.5"
            />
          </svg>
        </button>
      </Link>
    </div>
  );
};
