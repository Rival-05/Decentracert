import React from "react";
import { Key } from "lucide-react";

export const Issueform = () => {
  return (
    <div className="mx-auto my-2 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-2 shadow-md">
      <h2 className="mb-6 bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-center text-2xl font-semibold text-transparent sm:text-3xl md:text-4xl">
        Issue Certificate
      </h2>

      <form className="flex w-full max-w-lg flex-col space-y-3">
        <div className="flex w-full flex-col">
          <label
            htmlFor="recipient"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Recipient&apos;s Name
          </label>
          <input
            type="text"
            id="recipient"
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            placeholder="Name of the person to whom the certificate is issued."
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="title"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Certificate Title
          </label>
          <input
            type="text"
            id="title"
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            required
            placeholder="Course, degree, or award title."
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="date"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Issue Date
          </label>
          <input
            type="date"
            id="date"
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide text-neutral-400 focus:outline-none sm:text-base"
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label
            htmlFor="details"
            className="mb-2 text-sm font-medium tracking-wide sm:text-base"
          >
            Additional Details
          </label>
          <textarea
            id="details"
            rows={4}
            className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
            placeholder="Any additional information about the certificate."
          />
        </div>

        {/* Keys */}
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="flex w-full flex-col sm:w-1/2">
            <label
              htmlFor="privateKey"
              className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wide sm:text-base"
            >
              <Key className="inline-block h-5 w-5 text-red-600/80" />
              Private key
            </label>
            <input
              type="text"
              id="privateKey"
              className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
              required
              placeholder="Enter your private key."
            />
          </div>

          <div className="flex w-full flex-col sm:w-1/2">
            <label
              htmlFor="publicKey"
              className="mb-2 flex items-center gap-2 text-sm font-medium tracking-wide sm:text-base"
            >
              <Key className="inline-block h-5 w-5 text-green-600/80" />
              Public key
            </label>
            <input
              type="text"
              id="publicKey"
              className="rounded-md border border-neutral-600 p-2 text-sm font-light tracking-wide focus:outline-none sm:text-base"
              required
              placeholder="Enter your public key."
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 cursor-pointer rounded-lg bg-neutral-300 px-4 py-2 text-sm font-medium tracking-wide text-neutral-800 transition-colors duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900 sm:px-6 sm:py-3 sm:text-base"
        >
          Issue Certificate
        </button>
      </form>
    </div>
  );
};
