import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ImageComponent } from "@/components/shared/ImageComponent";
import {
  SOLUTIONS_MORE_CARD,
  SOLUTIONS_QUOTE_CTA_URL,
} from "@/utils/constants";

export function SolutionsMoreCard() {
  return (
    <Link
      href={SOLUTIONS_QUOTE_CTA_URL}
      className="group relative flex w-full flex-col justify-end gap-2 overflow-hidden bg-black p-4 h-64 sm:h-72 sm:gap-3 sm:p-5 md:h-80 md:p-6 xl:h-96"
    >
      <ImageComponent
        src={SOLUTIONS_MORE_CARD.image}
        alt="Outros serviços executados pela equipe"
        classNameWrapper="absolute inset-0"
        classNameImg="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 426px"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

      <div className="absolute inset-0 translate-y-full bg-linear-to-t from-black/80 via-black/40 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0" />

      <span
        className="absolute top-3 right-3 font-display text-5xl leading-none text-white/10 transition-colors duration-500 ease-out group-hover:text-brand sm:top-4 sm:right-4 sm:text-6xl md:text-7xl xl:text-8xl"
        aria-hidden="true"
      >
        +
      </span>

      <div className="relative flex flex-col gap-2 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:gap-3">
        <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-xs sm:tracking-[0.25em]">
          {SOLUTIONS_MORE_CARD.eyebrow}
        </span>

        <h3 className="font-display text-base tracking-wide text-white text-balance sm:text-lg md:text-xl xl:text-2xl">
          {SOLUTIONS_MORE_CARD.title}
        </h3>

        <p className="text-xs leading-relaxed text-pretty text-white/70 sm:text-sm">
          {SOLUTIONS_MORE_CARD.description}
        </p>

        <span className="inline-flex items-center gap-2 pt-1 text-[0.7rem] font-bold tracking-widest text-brand-light transition-colors group-hover:text-white sm:text-xs md:text-sm">
          {SOLUTIONS_MORE_CARD.cta}
          <ArrowRight
            size={16}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
