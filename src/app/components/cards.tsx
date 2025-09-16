import React from "react";
import { Globe, Lock, Zap } from "lucide-react";

export const Cards = () => {
  return (
    <div className="grid gap-10 px-6 py-6 md:grid-cols-3">
      <div className="rounded-md bg-cyan-900/10 p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-cyan-900/30 p-1">
            <Lock className="h-5 w-5 text-cyan-600/80" />
          </div>
          <h3 className="text-primary-300 text-lg font-semibold">
            Tamper-Proof
          </h3>
        </div>
        <p className="text-neutral-500">
          Certificates are stored securely on decentralized IPFS.
        </p>
      </div>

      <div className="rounded-md bg-green-900/10 p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-green-900/30 p-1">
            <Zap className="h-5 w-5 text-green-600/80" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-300">
            Instant Verification
          </h3>
        </div>
        <p className="text-neutral-500">
          Verify authenticity in seconds from anywhere.
        </p>
      </div>

      <div className="rounded-md bg-yellow-900/10 p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-yellow-900/30 p-1">
            <Globe className="h-5 w-5 text-yellow-600/80" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-300">
            Accessible Anywhere
          </h3>
        </div>
        <p className="text-neutral-500">
          Works globally without any central authority.
        </p>
      </div>
    </div>
  );
};
