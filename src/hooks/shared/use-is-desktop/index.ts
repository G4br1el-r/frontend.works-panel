"use client";

import { useMediaQuery } from "@/hooks/shared/use-media-query";
import { DESKTOP_BREAKPOINT_PX } from "@/lib/utils/constants";

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT_PX}px)`);
}
