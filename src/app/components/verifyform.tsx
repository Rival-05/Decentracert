"use client";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Key } from "lucide-react";

export function VerifyForm() {
  const fields = [
    {
      id: "certificateId",
      label: "Certificate ID",
      placeholder: "Enter your certificate ID.",
    },
    {
      id: "publicKey",
      label: "Public Key",
      placeholder: "Enter your public key.",
      icon: Key,
    },
  ];

  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Verifying Certificate...");

    try {
      await new Promise((res) => setTimeout(res, 2000));
      toast.success("Certificate Verified Successfully!", { id: toastId });
    } catch {
      toast.error("Certificate Verification Failed. Please try again later.", {
        id: toastId,
      });
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto my-16 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-6 shadow-md sm:my-20 sm:p-8">
      <h2 className="mb-6 bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-center text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl">
        Verify Certificate
      </h2>

      <form
        onSubmit={handleVerify}
        className="flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4"
      >
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.id} className="relative flex-1">
              {Icon && (
                <Icon
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-green-600/80"
                />
              )}
              <input
                type="text"
                className={`w-full rounded-lg border border-neutral-600 px-3 py-2 text-sm font-light tracking-wide focus:outline-none sm:text-base ${
                  Icon ? "pl-9" : ""
                }`}
                placeholder={field.placeholder}
                required
              />
            </div>
          );
        })}
        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer rounded-lg bg-neutral-200 px-4 py-2 text-sm font-medium tracking-wide text-neutral-800 transition-colors duration-300 text-shadow-xs hover:bg-neutral-400 hover:text-neutral-900 sm:px-6 sm:text-base ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
        <Toaster position="top-center" />
      </form>
    </div>
  );
}
