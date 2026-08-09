"use client";

import Link from "next/link";
import { useScrollToSection } from "@/hooks/shared/use-scroll-to-section";

type ScrollIndicatorProps = {
  targetId: string;
};

export function ScrollIndicator({ targetId }: ScrollIndicatorProps) {
  const handleClick = useScrollToSection();

  return (
    <Link
      href={`#${targetId}`}
      onClick={handleClick}
      aria-label="Ir para a próxima seção"
      className="animate-scroll-indicator-in group absolute bottom-15 sm:bottom-20 left-1/2 hidden [@media(min-height:420px)]:flex -translate-x-1/2 flex-col items-center gap-2 sm:gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-light"
    >
      <svg
        width="28"
        height="52"
        viewBox="0 0 28 52"
        fill="none"
        aria-hidden="true"
        className="animate-scroll-indicator-swing overflow-visible text-brand/70 transition-colors duration-300 group-hover:text-brand-light"
      >
        <path
          d="M6 2h16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M14 2v28" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M14 30l6 8-6 10-6-10 6-8z"
          fill="currentColor"
          fillOpacity="0.9"
        />
      </svg>

      <span className="animate-scroll-indicator-pulse text-[11px] tracking-[0.25em] text-brand/70 transition-colors duration-300 group-hover:text-brand-light">
        VEJA A OBRA
      </span>
    </Link>
  );
}
