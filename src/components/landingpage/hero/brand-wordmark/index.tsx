"use client";

import { motion } from "motion/react";
import { QuoteCta } from "@/components/landingpage/hero/quote-cta";

const GOULART_LETTERS = [
  { char: "G", id: "letter-1" },
  { char: "O", id: "letter-2" },
  { char: "U", id: "letter-3" },
  { char: "L", id: "letter-4" },
  { char: "A", id: "letter-5" },
  { char: "R", id: "letter-6" },
  { char: "T", id: "letter-7" },
];

export function BrandWordmark() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-center px-2">
      <motion.span
        initial={{ opacity: 0, y: 10, letterSpacing: "0.1em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.3em" }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        className="relative text-neutral-300 text-sm sm:text-base font-semibold"
      >
        GUILHERME
      </motion.span>

      <div className="relative flex overflow-hidden">
        {GOULART_LETTERS.map(({ char, id }, i) => (
          <motion.span
            key={id}
            initial={{ opacity: 0, y: "100%", rotateX: 90 }}
            animate={{ opacity: 1, y: "0%", rotateX: 0 }}
            transition={{
              delay: 0.5 + i * 0.06,
              duration: 2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block text-5xl sm:text-7xl md:text-8xl font-display tracking-wide bg-linear-to-b from-brand-light via-brand to-brand-deep bg-clip-text text-transparent"
            style={{ transformOrigin: "bottom" }}
          >
            {char}
          </motion.span>
        ))}
      </div>

      <motion.div
        className="relative h-px w-full bg-linear-to-r from-transparent via-brand to-transparent"
        initial={{ width: "0%", opacity: 0 }}
        animate={{ width: "40%", opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
      />

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="relative text-neutral-300 tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-lg font-medium"
      >
        PRESTAÇÃO DE SERVIÇOS
      </motion.span>

      <QuoteCta />
    </div>
  );
}
