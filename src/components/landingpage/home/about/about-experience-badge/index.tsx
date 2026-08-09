import { FadeIn } from "@/components/motion/fade-in";
import { AnimatedCounter } from "@/components/shared/animated-counter";

export function AboutExperienceBadge() {
  return (
    <FadeIn
      direction="none"
      fromScale={0.85}
      duration={0.5}
      className="flex w-full shrink-0 flex-row items-center justify-center gap-3 border border-brand/30 bg-black/70 px-5 py-4 text-center backdrop-blur-md lg:w-40 lg:flex-col lg:gap-1 lg:py-6"
    >
      <AnimatedCounter
        value={20}
        suffix="+"
        duration={2}
        className="font-display text-2xl text-brand"
      />
      <span className="text-xs font-semibold leading-tight tracking-widest text-neutral-300">
        ANOS DE EXPERIÊNCIA
      </span>
      <div className="mt-1 hidden h-px w-8 bg-brand lg:block" />
    </FadeIn>
  );
}
