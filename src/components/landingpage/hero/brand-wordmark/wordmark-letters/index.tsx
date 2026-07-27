"use client";

import { motion } from "motion/react";
import { HERO_BRAND_WORDMARK_LETTERS } from "@/utils/constants";

const LETTER_CLASS =
  "inline-block text-5xl sm:text-7xl md:text-8xl font-display tracking-wide bg-linear-to-b from-brand-light via-brand to-brand-deep bg-clip-text text-transparent";

export function WordmarkLetters() {
  return (
    <div className="relative flex overflow-hidden">
      {HERO_BRAND_WORDMARK_LETTERS.map(({ char, id }, i) => (
        <motion.span
          key={id}
          initial={{ opacity: 0, y: "100%", rotateX: 90 }}
          animate={{ opacity: 1, y: "0%", rotateX: 0 }}
          transition={{
            delay: 0.5 + i * 0.06,
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={LETTER_CLASS}
          style={{ transformOrigin: "bottom" }}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
