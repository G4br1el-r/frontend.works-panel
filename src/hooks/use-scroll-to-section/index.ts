"use client";

import type { MouseEvent } from "react";
import { useCallback } from "react";

export function useScrollToSection(onNavigate?: () => void) {
  return useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const href = event.currentTarget.getAttribute("href");

      if (href?.startsWith("#")) {
        event.preventDefault();
        document
          .getElementById(href.slice(1))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      onNavigate?.();
    },
    [onNavigate],
  );
}
