import type { Variants } from "motion/react";

export type FadeDirection = "up" | "down" | "left" | "right" | "none";

const OFFSET_BY_DIRECTION: Record<
  FadeDirection,
  (distance: number) => { x?: number; y?: number }
> = {
  up: (distance) => ({ y: distance }),
  down: (distance) => ({ y: -distance }),
  left: (distance) => ({ x: distance }),
  right: (distance) => ({ x: -distance }),
  none: () => ({}),
};

export function buildFadeVariants(
  direction: FadeDirection,
  distance: number,
  fromScale?: number,
): Variants {
  return {
    hidden: {
      opacity: 0,
      ...OFFSET_BY_DIRECTION[direction](distance),
      ...(fromScale === undefined ? {} : { scale: fromScale }),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      ...(fromScale === undefined ? {} : { scale: 1 }),
    },
  };
}

export const DEFAULT_VIEWPORT = { once: true, margin: "-80px" } as const;

export const DEFAULT_EASE = "easeOut" as const;
