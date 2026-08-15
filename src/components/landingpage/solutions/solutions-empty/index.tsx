import { PackageSearch } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export function SolutionsEmpty() {
  return (
    <FadeIn
      direction="up"
      distance={16}
      duration={0.5}
      className="flex flex-col items-center justify-center gap-5 border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center sm:py-20 md:py-24"
    >
      <span className="flex size-14 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
        <PackageSearch className="size-6" aria-hidden="true" />
      </span>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-lg tracking-wide text-white text-balance sm:text-xl">
          Nenhum serviço disponível no momento
        </h3>
        <p className="max-w-md text-pretty text-sm leading-relaxed text-white/60 sm:text-base">
          Estamos atualizando nossa lista de serviços.
        </p>
      </div>
    </FadeIn>
  );
}
