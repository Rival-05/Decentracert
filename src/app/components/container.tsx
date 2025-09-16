import React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 md:py-3">
      {children}
    </div>
  );
};
