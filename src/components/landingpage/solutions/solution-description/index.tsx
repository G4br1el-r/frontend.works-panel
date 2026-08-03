import { FadeIn } from "@/components/motion/fade-in";

interface SolutionDescriptionProps {
  description: string;
}

export function SolutionDescription({ description }: SolutionDescriptionProps) {
  return (
    <FadeIn
      direction="up"
      distance={16}
      duration={0.5}
      className="flex flex-col gap-5 border-b border-white/10 pb-10 sm:pb-12"
    >
      <span className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-xs md:tracking-[0.25em]">
        <span
          className="animate-brand-dot size-1.5 shrink-0 rounded-full bg-brand motion-reduce:animate-none"
          aria-hidden="true"
        />
        SOBRE O SERVIÇO
      </span>

      <div className="flex gap-4 sm:gap-6">
        <div className="w-0.5 shrink-0 self-stretch bg-linear-to-b from-brand via-brand/40 to-transparent" />

        <p className="min-w-0 max-w-3xl font-display text-lg leading-snug text-balance text-white min-[400px]:text-xl sm:text-2xl md:text-3xl">
          {description}
        </p>
      </div>
    </FadeIn>
  );
}
