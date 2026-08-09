"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--panel-surface)",
          color: "var(--panel-surface-foreground)",
          border: "1px solid var(--panel-border)",
          borderRadius: "var(--radius-lg)",
          fontSize: "0.875rem",
          boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
        },
        success: {
          iconTheme: {
            primary: "var(--status-success)",
            secondary: "var(--panel-surface)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--status-danger)",
            secondary: "var(--panel-surface)",
          },
        },
      }}
    />
  );
}
