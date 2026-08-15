"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#000000",
          color: "#ffffff",
          border: "1px solid rgb(255 255 255 / 0.1)",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.4)",
        },
        success: {
          iconTheme: {
            primary: "var(--color-brand)",
            secondary: "#000000",
          },
        },
        error: {
          iconTheme: {
            primary: "#f87171",
            secondary: "#000000",
          },
        },
      }}
    />
  );
}
