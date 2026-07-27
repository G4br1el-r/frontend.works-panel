"use client";

import { motion } from "motion/react";

export function WordmarkRule() {
  return (
    <motion.div
      className="relative h-px w-full bg-linear-to-r from-transparent via-brand to-transparent"
      initial={{ width: "0%", opacity: 0 }}
      animate={{ width: "40%", opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
    />
  );
}
