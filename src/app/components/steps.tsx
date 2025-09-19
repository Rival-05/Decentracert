"use client";

import React from "react";
import { useEffect, useState } from "react";
export const Steps = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div id="steps" className="mt-10 px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="mb-10 bg-gradient-to-b from-neutral-50 to-neutral-300 bg-clip-text text-center text-2xl font-bold text-transparent sm:mb-12 sm:text-3xl md:text-4xl">
        How It Works
      </h2>
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 md:grid-cols-3">
        {[
          {
            step: "1",
            title: "Fill Details",
            desc: "Enter recipient info, title, and date.",
          },
          {
            step: "2",
            title: "Generate & Sign",
            desc: "Your certificate is hashed and signed securely.",
          },
          {
            step: "3",
            title: "Store & Share",
            desc: "Stored on IPFS with a unique verification code.",
          },
        ].map((item, idx) => (
          <div key={idx} className="relative text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-lg font-bold text-neutral-100 shadow-lg sm:h-16 sm:w-16 sm:text-xl">
              {item.step}
            </div>

            <h3 className="mb-2 text-base font-semibold sm:text-lg md:text-xl">
              {item.title}
            </h3>

            <p className="text-sm text-gray-400 sm:text-base">{item.desc}</p>

            {idx < 2 && (
              <svg
                className={`absolute top-7 right-[-40px] hidden md:block ${
                  animate ? "draw" : ""
                }`}
                width="80"
                height="20"
                viewBox="0 0 100 20"
              >
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ff88">
                    <animate
                      attributeName="offset"
                      values="0;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stopColor="#00ffaa" stopOpacity="0">
                    <animate
                      attributeName="offset"
                      values="0;1"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </stop>
                </linearGradient>

                <path
                  d="M0 10 Q50 0 100 10"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4"
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
