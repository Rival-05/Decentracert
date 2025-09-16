import Link from "next/link";
import React from "react";

export const Hero = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center gap-6 py-18 text-center">
      <h1 className="max-w-2xl bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-6xl font-semibold tracking-tight text-transparent">
        Say Goodbye to Fake Certificates !
      </h1>
      <p className="text-lg font-light text-neutral-400">
        A smarter way to issue and check certificates — secure, simple, and
        trusted.
      </p>
      <Link href={"/issue"} className="mt-4">
        <button className="text-md flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-300 px-4 py-2 font-medium tracking-tight text-neutral-800 transition-all duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900">
          Start issuing certificates
          <svg width="16" height="16" fill="none">
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
