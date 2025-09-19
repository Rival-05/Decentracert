import React from "react";
import { Globe, Lock, Zap } from "lucide-react";

export const Cards = () => {
  return (
    <div className="grid gap-6 px-4 py-8 sm:gap-8 md:grid-cols-3 md:gap-10">
      <div className="rounded-md bg-cyan-900/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-cyan-900/30 p-2">
            <Lock className="h-5 w-5 text-cyan-600/80" />
          </div>
          <h3 className="text-lg font-medium text-cyan-300/90">Tamper-Proof</h3>
        </div>
        <p className="text-sm text-neutral-500 sm:text-base">
          Certificates are stored securely on decentralized IPFS.
        </p>
      </div>

      <div className="rounded-md bg-green-900/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-green-900/30 p-2">
            <Zap className="h-5 w-5 text-green-600/80" />
          </div>
          <h3 className="text-lg font-medium text-green-300/90">
            Instant Verification
          </h3>
        </div>
        <p className="text-sm text-neutral-500 sm:text-base">
          Verify authenticity in seconds from anywhere.
        </p>
      </div>

      <div className="rounded-md bg-yellow-900/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="rounded-md bg-yellow-900/30 p-2">
            <Globe className="h-5 w-5 text-yellow-600/80" />
          </div>
          <h3 className="text-lg font-medium text-yellow-300/90">
            Accessible Anywhere
          </h3>
        </div>
        <p className="text-sm text-neutral-500 sm:text-base">
          Works globally without any central authority.
        </p>
      </div>
    </div>
  );
};
