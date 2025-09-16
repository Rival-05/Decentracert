import React from "react";

export const Issueform = () => {
  return (
    <div className="mx-auto my-4 flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-4 shadow-md">
      <h2 className="mb-6 bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-center text-4xl font-semibold text-transparent">
        Issue Certificate
      </h2>
      <form className="flex w-full max-w-lg flex-col items-center space-y-2">
        <div className="flex w-full flex-col">
          <label htmlFor="recipient" className="mb-2 text-sm font-medium">
            Recipient&apos;s Name
          </label>
          <input
            type="text"
            id="recipient"
            className="rounded-md border border-neutral-600 p-2 text-xs focus:outline-none"
            placeholder="Name of the person to whom the certificate is issued."
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="title" className="mb-2 text-sm font-medium">
            Certificate Title
          </label>
          <input
            type="text"
            id="title"
            className="rounded-md border border-neutral-600 p-2 text-xs focus:outline-none"
            required
            placeholder="Course, degree, or award title."
          />
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="date" className="mb-2 text-sm font-medium">
            Issue Date
          </label>
          <input
            type="date"
            id="date"
            className="rounded-md border border-neutral-600 p-2 text-xs text-neutral-400 focus:outline-none"
            required
          />
        </div>

        <div className="flex w-full flex-col">
          <label htmlFor="details" className="mb-2 text-sm font-medium">
            Additional Details
          </label>
          <textarea
            id="details"
            rows={4}
            className="rounded-md border border-neutral-600 p-2 text-xs focus:outline-none"
            placeholder="Any additional information about the certificate."
          />
        </div>

        <button
          type="submit"
          className="mt-3 cursor-pointer rounded-lg bg-neutral-300 px-4 py-2 text-sm font-medium tracking-wide text-neutral-800 transition-all duration-300 text-shadow-xs hover:bg-neutral-50 hover:text-neutral-900"
        >
          Issue Certificate
        </button>
      </form>
    </div>
  );
};
