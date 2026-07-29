"use client";

import { motion } from "motion/react";
import { DEFAULT_VIEWPORT } from "@/components/motion/variants";

export function AboutRule() {
  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: 64 }}
      viewport={DEFAULT_VIEWPORT}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-px bg-brand"
    />
  );
}
