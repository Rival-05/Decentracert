import React from "react";

export function VerifyForm() {
  return (
    <div className="mx-auto my-20 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-8 shadow-md">
      <h2 className="mb-6 bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-center text-4xl font-semibold text-transparent">
        Verify Certificate
      </h2>

      <div className="flex w-full max-w-xl flex-row justify-center gap-4">
        <input
          type="text"
          className="flex-1 rounded-lg border border-neutral-600 px-3 py-2 text-sm font-light focus:outline-none"
          placeholder="Enter certificate ID or hash"
          required
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-neutral-300 px-4 py-2 text-sm font-medium tracking-wide text-neutral-800 transition-all duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
