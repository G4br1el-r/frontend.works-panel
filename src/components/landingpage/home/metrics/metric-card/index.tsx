import type { LucideIcon } from "lucide-react";
import { MetricCounter } from "@/components/landingpage/home/metrics/metric-counter";

interface MetricCardProps {
  icon: LucideIcon;
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
  description: string;
  index: number;
}

export function MetricCard({
  icon: Icon,
  value,
  decimals,
  prefix,
  suffix,
  label,
  description,
  index,
}: MetricCardProps) {
  return (
    <>
      <span
        className="pointer-events-none absolute top-1.5 right-2.5 font-display text-4xl leading-none text-white/5 transition-colors duration-500 ease-out group-hover:text-brand/20 min-[400px]:text-5xl sm:top-2 sm:right-3 sm:text-6xl xl:text-7xl"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <span
        className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-100"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-brand via-brand-light to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden="true"
      />

      <span className="relative flex size-9 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-500 ease-out group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-(--shadow-brand-hover) sm:size-10">
        <Icon size={18} className="stroke-[1.5]" aria-hidden="true" />
      </span>

      <span className="relative">
        <MetricCounter
          value={value}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
        />
      </span>

      <div className="relative h-0.5 w-10 bg-brand/70 transition-all duration-500 ease-out group-hover:w-16 group-hover:bg-brand" />

      <h3 className="relative font-display text-sm tracking-wide text-white text-balance sm:text-base xl:text-lg">
        {label}
      </h3>

      <p className="relative text-xs leading-relaxed text-pretty text-neutral-400 transition-colors duration-500 ease-out group-hover:text-neutral-200 sm:text-sm">
        {description}
      </p>
    </>
  );
}
