"use client";

import { motion } from "motion/react";

type ScrollIndicatorProps = {
  targetId: string;
};

export function ScrollIndicator({ targetId }: ScrollIndicatorProps) {
  return (
    <motion.a
      href={`#${targetId}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 0.8 }}
      aria-label="Ir para a próxima seção"
      className="group absolute bottom-15 sm:bottom-20 left-1/2 hidden [@media(min-height:420px)]:flex -translate-x-1/2 flex-col items-center gap-2 sm:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light"
    >
      <motion.svg
        width="28"
        height="52"
        viewBox="0 0 28 52"
        fill="none"
        aria-hidden="true"
        className="overflow-visible text-brand/70 transition-colors duration-300 group-hover:text-brand-light"
        style={{ transformOrigin: "14px 2px" }}
        animate={{ rotate: [-6, 6, -6] }}
        transition={{
          duration: 3.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <path d="M6 2h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 2v28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 30l6 8-6 10-6-10 6-8z" fill="currentColor" fillOpacity="0.9" />
      </motion.svg>

      <motion.span
        className="text-[11px] tracking-[0.25em] text-brand/70 transition-colors duration-300 group-hover:text-brand-light"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          duration: 2.4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        VEJA A OBRA
      </motion.span>
    </motion.a>
  );
}
