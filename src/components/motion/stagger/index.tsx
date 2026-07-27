"use client";

import { motion } from "motion/react";
import type { ElementType, ReactNode } from "react";
import {
  buildFadeVariants,
  DEFAULT_EASE,
  DEFAULT_VIEWPORT,
  type FadeDirection,
} from "@/components/motion/variants";

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
  delay?: number;
  className?: string;
  as?: ElementType;
  onMount?: boolean;
}

export function Stagger({
  children,
  staggerDelay = 0.06,
  delay = 0,
  className,
  as = "div",
  onMount = false,
}: StaggerProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;
  const trigger = onMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: DEFAULT_VIEWPORT };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: delay },
        },
      }}
      {...trigger}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  direction?: FadeDirection;
  duration?: number;
  distance?: number;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

export function StaggerItem({
  children,
  direction = "up",
  duration = 0.4,
  distance = 12,
  className,
  as = "div",
  style,
}: StaggerItemProps) {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      style={style}
      variants={buildFadeVariants(direction, distance)}
      transition={{ duration, ease: DEFAULT_EASE }}
    >
      {children}
    </MotionTag>
  );
}
