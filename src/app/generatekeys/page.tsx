"use client";
import React from "react";
import { Container } from "../components/container";
import { Keys } from "../components/keys";

export default function Verify() {
  return (
    <div className="selection:bg-primary/20 relative mt-8 w-full">
      <div
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
        }}
      />
      <Container>
        <Keys />
      </Container>
    </div>
  );
}
