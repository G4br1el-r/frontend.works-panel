"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import {
  METRICS_ANIMATION_DELAY,
  METRICS_COUNTER_DURATION,
} from "@/utils/constants";

interface MetricCounterProps {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
}

export function MetricCounter({
  value,
  decimals,
  prefix,
  suffix,
}: MetricCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const count = useMotionValue(0);
  const formatted = useTransform(count, (latest) =>
    latest.toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: METRICS_COUNTER_DURATION,
      delay: METRICS_ANIMATION_DELAY,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [isInView, value, count]);

  return (
    <span
      ref={ref}
      className="flex items-end font-display leading-none text-white"
    >
      {prefix ? (
        <span className="text-2xl text-brand min-[400px]:text-3xl sm:text-4xl xl:text-5xl">
          {prefix}
        </span>
      ) : null}

      <motion.span className="text-[2.5rem] tabular-nums min-[400px]:text-5xl sm:text-6xl xl:text-7xl">
        {formatted}
      </motion.span>

      <span className="pb-0.5 text-lg text-brand min-[400px]:text-xl sm:pb-1.5 sm:text-2xl xl:text-3xl">
        {suffix}
      </span>
    </span>
  );
}
