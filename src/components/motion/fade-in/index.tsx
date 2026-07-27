"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import {
  buildFadeVariants,
  DEFAULT_EASE,
  DEFAULT_VIEWPORT,
  type FadeDirection,
} from "@/components/motion/variants";

interface FadeInProps {
  children: ReactNode;
  direction?: FadeDirection;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
  as?: ElementType;
  fromScale?: number;
  onMount?: boolean;
}

export function FadeIn({
  children,
  direction = "up",
  duration = 0.5,
  delay = 0,
  distance = 16,
  className,
  as = "div",
  fromScale,
  onMount = false,
}: FadeInProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const variants = buildFadeVariants(direction, distance, fromScale);
  const trigger = onMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: DEFAULT_VIEWPORT };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      transition={{ duration, delay, ease: DEFAULT_EASE }}
      {...trigger}
    >
      {children}
    </MotionTag>
  );
}
