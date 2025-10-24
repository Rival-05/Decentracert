import React, { useState } from "react";
import { generateECDSAKeysBase64 } from "../hashing/keygenerate";
import toast, { Toaster } from "react-hot-toast";
import { Key } from "lucide-react";

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
    <div className="relative mx-auto my-16 flex w-full max-w-4xl flex-col items-center justify-center p-6 shadow-md sm:my-20 sm:p-8">
      <button
        className="flex cursor-pointer items-center gap-2 rounded-lg bg-neutral-200 px-2 py-1 text-sm font-medium tracking-tight text-neutral-800 transition-colors duration-300 hover:bg-neutral-400 hover:text-neutral-900 sm:text-base"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      <Toaster position="top-center" />
      <div className="item-center mt-8 flex w-full max-w-3xl justify-center gap-4">
        {keyFields.map(
          ({ label, value, color }) =>
            value && (
              <div key={label} className="my-4">
                <div className="mb-2 flex items-center gap-2 font-normal">
                  <Key className={`h-4 w-4 ${color}`} />
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-0">
                  <textarea
                    className="cursor-default rounded-l-lg border border-r-0 border-neutral-600 px-2 py-1 text-sm font-light tracking-wide focus:outline-none sm:text-base"
                    readOnly
                    rows={1}
                    value={value}
                  />
                  <button
                    className="cursor-pointer rounded-r-lg border border-l-0 border-neutral-600 bg-neutral-800 px-2 py-1 font-light tracking-wide text-neutral-200 transition hover:bg-neutral-900 hover:text-neutral-100"
                    onClick={() => handleCopy(value, label)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
