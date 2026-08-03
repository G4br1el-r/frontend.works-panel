import { Quote } from "lucide-react";
import { getInitials } from "@/utils/get-initials";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
      <span
        className="pointer-events-none absolute -top-10 left-1/2 size-28 -translate-x-1/2 rounded-full bg-brand/5 blur-3xl sm:size-40"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Quote
          className="size-12 shrink-0 fill-brand/20 text-brand sm:size-16"
          aria-hidden="true"
        />

        <p className="text-lg leading-relaxed text-pretty text-neutral-300 sm:text-xl md:text-2xl">
          {quote}
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-6 sm:gap-8">
        <div className="h-0.5 w-14 bg-brand" />

        <div className="flex flex-col items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-brand/10 text-sm font-bold tracking-wide text-brand sm:size-14 sm:text-base">
            {getInitials(name)}
          </span>

          <div className="flex flex-col items-center">
            <span className="font-display text-sm tracking-wide text-white sm:text-base">
              {name}
            </span>
            <span className="text-xs font-semibold tracking-wide text-brand sm:text-sm">
              {role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
