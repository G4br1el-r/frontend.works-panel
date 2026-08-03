import { WordmarkLetters } from "@/components/landingpage/home/hero/brand-wordmark/wordmark-letters";
import { WordmarkRule } from "@/components/landingpage/home/hero/brand-wordmark/wordmark-rule";
import { QuoteCta } from "@/components/landingpage/home/hero/quote-cta";
import { FadeIn } from "@/components/motion/fade-in";

export function BrandWordmark() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-4 text-center px-2">
      <span className="animate-wordmark-eyebrow relative text-neutral-300 text-sm sm:text-base font-semibold">
        GUILHERME
      </span>

      <WordmarkLetters />

      <WordmarkRule />

      <FadeIn
        as="span"
        onMount
        direction="up"
        distance={10}
        delay={1.15}
        duration={0.6}
        className="relative text-neutral-300 tracking-[0.2em] sm:tracking-[0.25em] text-xs sm:text-lg font-medium"
      >
        PRESTAÇÃO DE SERVIÇOS
      </FadeIn>

      <QuoteCta />
    </div>
  );
}
