"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const STRIPE_BACKGROUND =
  "repeating-linear-gradient(135deg, var(--color-brand) 0 22px, #0a0a0a 22px 44px)";

export function CautionStripe() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  return (
    <div ref={ref} className="h-3 w-full overflow-hidden sm:h-4">
      <motion.div
        className="h-full"
        style={{
          backgroundImage: STRIPE_BACKGROUND,
          backgroundSize: "62px 62px",
        }}
        initial={{ width: "0%" }}
        animate={{
          width: isInView ? "100%" : "0%",
          backgroundPositionX: [0, 62],
        }}
        transition={{
          width: { duration: 1.8, ease: [0.16, 1, 0.3, 1] },
          backgroundPositionX: {
            duration: 1.8,
            repeat: Infinity,
            ease: "linear",
          },
        }}
        aria-hidden="true"
      />
    </div>
  );
}
