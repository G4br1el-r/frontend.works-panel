"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const QUOTE_URL = "/orcamento";

const CLIP_PATH = "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)";

export function QuoteCta() {
  return (
    <motion.a
      href={QUOTE_URL}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.9, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="animate-brand-pulse motion-reduce:animate-none group relative mt-6 inline-flex items-center gap-2 overflow-hidden whitespace-nowrap bg-linear-to-r from-brand-light via-brand to-brand-deep px-6 py-3 text-sm font-bold tracking-widest text-black transition-shadow duration-300 hover:shadow-(--shadow-brand-hover) sm:mt-8 sm:gap-3 sm:px-9 sm:py-3.5 sm:text-lg"
      style={{ clipPath: CLIP_PATH }}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />

      <span className="relative">SOLICITAR ORÇAMENTO</span>

      <ArrowRight
        size={18}
        className="relative transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </motion.a>
  );
}
