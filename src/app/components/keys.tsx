import React, { useState } from "react";
import { generateECDSAKeysBase64 } from "../hashing/keygenerate";
import toast, { Toaster } from "react-hot-toast";
import { Key, Copy, Sparkle } from "lucide-react";

export function Keys() {
  const [keys, setKeys] = useState({ privateKey: "", publicKey: "" });
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { b64privatekey, b64publickey } = await generateECDSAKeysBase64();
      setKeys({ privateKey: b64privatekey, publicKey: b64publickey });
      toast.success("Keys generated!");
    } catch {
      toast.error("Key generation failed.");
    }
    setLoading(false);
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied!`);
    } catch {
      toast.error("Copy failed!");
    }
  };

  const keyFields = [
    { label: "Private Key", value: keys.privateKey, color: "text-red-600/80" },
    { label: "Public Key", value: keys.publicKey, color: "text-green-600/80" },
  ];

  return (
    <div className="relative mx-auto my-14 flex w-full max-w-4xl flex-col items-center justify-center p-6 shadow-md sm:my-20 sm:p-8">
      <button
        className="group relative flex cursor-pointer items-center justify-between gap-2 overflow-hidden rounded-lg border border-zinc-500 px-4 py-1 transition-all duration-300 hover:shadow-[0_0_8px_#00000040] dark:border-zinc-700 dark:hover:shadow-[0_0_8px_#ffffff40]"
        onClick={handleGenerate}
        disabled={loading}
      >
        <span className="text-sm sm:text-base">
          {loading ? "Generating..." : "Generate"}
        </span>
        <Sparkle
          size={18}
          className="relative z-10 text-zinc-400 transition-all duration-300 group-hover:text-amber-400"
        />
        <span className="absolute top-0 left-[-75%] h-full w-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-[100%] group-hover:opacity-100" />
      </button>
      <Toaster position="top-center" />
      <div className="mt-10 flex w-full max-w-3xl flex-col items-center justify-center gap-1 sm:flex-row sm:gap-4">
        {keyFields.map(
          ({ label, value, color }) =>
            value && (
              <div key={label} className="my-4">
                <div className="mb-2 flex items-center gap-2 font-normal">
                  <Key className={`h-4 w-4 ${color}`} />
                  <span>{label}</span>
                </div>
                <div className="flex h-8 items-stretch gap-0">
                  <textarea
                    className="cursor-default rounded-l-lg border border-r-0 border-neutral-600 px-2 py-1 text-sm font-light tracking-wide focus:outline-none sm:text-base"
                    readOnly
                    rows={1}
                    value={value}
                  />
                  <button
                    className={`cursor-pointer rounded-r-lg border border-l-0 border-neutral-600 bg-neutral-800 px-2 text-sm font-light tracking-tight text-neutral-200 hover:bg-neutral-900 hover:text-neutral-100 ${
                      loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}
                    onClick={() => handleCopy(value, label)}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
      {(keys.privateKey || keys.publicKey) && (
        <h3 className="mt-4 flex w-full items-center justify-center text-xs font-light text-neutral-300 sm:text-sm md:text-base">
          - Kindly do not share the private key with anyone.
        </h3>
      )}
    </div>
  );
}
