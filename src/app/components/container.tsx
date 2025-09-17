import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-2 py-1.5 sm:px-4 sm:py-3">
      {children}
    </div>
  );
};
