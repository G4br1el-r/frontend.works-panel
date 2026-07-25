"use client";

import { motion } from "motion/react";

const METRICS = [
  { id: "years", value: "8+", label: "ANOS DE EXPERIÊNCIA" },
  { id: "projects", value: "150+", label: "PROJETOS ENTREGUES" },
  { id: "clients", value: "100%", label: "CLIENTES SATISFEITOS" },
  { id: "response", value: "24H", label: "TEMPO DE RESPOSTA" },
];

export function Metrics() {
  return (
    <section className="px-4  py-16 sm:py-24 relative w-full">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 text-center sm:grid-cols-4">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-display text-4xl text-brand-light sm:text-6xl">{metric.value}</p>
            <p className="mt-2 text-xs tracking-[0.2em] text-neutral-400 sm:text-sm">{metric.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
