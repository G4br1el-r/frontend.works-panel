"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 2,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(
    count,
    (latest) => `${Math.round(latest)}${suffix}`,
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [isInView, value, duration, count]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
