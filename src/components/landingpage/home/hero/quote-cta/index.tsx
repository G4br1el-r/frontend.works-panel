import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import {
  HERO_QUOTE_CTA_URL,
  NOTCHED_BUTTON_CLIP_PATH,
} from "@/utils/constants";

export function QuoteCta() {
  return (
    <FadeIn
      onMount
      direction="up"
      distance={16}
      delay={1.45}
      duration={0.6}
      className="mt-6 sm:mt-8"
    >
      <Link
        href={HERO_QUOTE_CTA_URL}
        className="animate-brand-pulse motion-reduce:animate-none group relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap bg-linear-to-r from-brand-light via-brand to-brand-deep px-6 py-3 text-sm font-bold tracking-widest text-black transition-all duration-300 ease-in-out hover:shadow-(--shadow-brand-hover) hover:scale-104 active:scale-97 sm:gap-3 sm:px-9 sm:py-3.5 sm:text-lg"
        style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden" />

        <span className="relative">SOLICITAR ORÇAMENTO</span>

        <ArrowRight
          size={18}
          className="relative transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </FadeIn>
  );
}
