"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { DESKTOP_BREAKPOINT_PX } from "@/utils/constants";

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);
}
