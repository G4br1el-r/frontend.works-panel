import { cn } from "@/utils/cn";

interface SectionHeadingProps {
  eyebrow: string;
  lines: string[];
  className?: string;
}

export function SectionHeading({
  eyebrow,
  lines,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3", className)}>
      <span className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-xs md:text-sm md:tracking-[0.25em]">
        <span
          className="animate-brand-dot size-1.5 shrink-0 rounded-full bg-brand motion-reduce:animate-none"
          aria-hidden="true"
        />
        {eyebrow}
      </span>

      <h2 className="font-display text-[2rem] leading-none text-white sm:text-5xl md:text-6xl xl:text-7xl">
        {lines.map((line, index) => (
          <span key={line}>
            {index > 0 && <br />}
            {line}
          </span>
        ))}
      </h2>

      <div className="mt-1 h-px w-16 bg-brand sm:w-20" />
    </div>
  );
}
