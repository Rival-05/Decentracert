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
    <div id="steps" className="mt-10 px-6 py-16">
      <h2 className="mb-12 bg-gradient-to-b from-neutral-50 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent">
        How It Works
      </h2>
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
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
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl font-bold text-neutral-100 shadow-lg">
              {item.step}
            </div>
            <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-400">{item.desc}</p>
            {idx < 2 && (
              <svg
                className={`absolute top-8 right-[-50px] hidden md:block ${
                  animate ? "draw" : ""
                }`}
                width="80"
                height="20"
                viewBox="0 0 100 20"
              >
                <path
                  d="M0 10 Q50 0 100 10"
                  stroke="#00ff88"
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
