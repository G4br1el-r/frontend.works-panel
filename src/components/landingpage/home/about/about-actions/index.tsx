"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { NOTCHED_BUTTON_CLIP_PATH } from "@/utils/constants";

export function AboutActions() {
  const handleClick = useScrollToSection();

  return (
    <FadeIn
      direction="up"
      distance={12}
      duration={0.4}
      className="flex  flex-col items-stretch gap-4 pt-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
    >
      <Link
        href="/"
        className="inline-flex transition-all duration-300 ease-in-out items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-5 py-3 text-xs font-bold tracking-widest text-black hover:shadow-(--shadow-brand-hover) hover:scale-104 active:scale-97 sm:px-6 sm:text-sm"
        style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
      >
        FALE CONOSCO
        <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
      </Link>

      <Link
        href="#solucoes"
        onClick={handleClick}
        className="group inline-flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-brand-light transition-colors hover:text-brand sm:justify-start sm:text-sm"
      >
        NOSSOS SERVIÇOS
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </FadeIn>
  );
}
