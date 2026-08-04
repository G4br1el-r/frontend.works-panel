"use client";

import { Trash2 } from "lucide-react";
import { ServiceItem } from "@/components/landingpage/solutions/solution-services/service-item";
import { FadeIn } from "@/components/motion/fade-in";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { useCartStore } from "@/store/landingpage/solutions/cart-store";

interface SolutionServicesProps {
  servicos: string[];
  solutionLabel: string;
}

export function SolutionServices({
  servicos,
  solutionLabel,
}: SolutionServicesProps) {
  const selectedCount = useCartStore(
    (state) => state.cart[solutionLabel]?.length ?? 0,
  );
  const clearSolution = useCartStore((state) => state.clearSolution);

  return (
    <div>
      <FadeIn
        direction="up"
        distance={16}
        duration={0.5}
        className="mt-10 flex items-center justify-between gap-4 sm:mt-12"
      >
        <span className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-brand sm:text-xs sm:tracking-[0.2em] md:tracking-[0.25em]">
          <span
            className="animate-brand-dot size-1.5 shrink-0 rounded-full bg-brand motion-reduce:animate-none"
            aria-hidden="true"
          />
          ADICIONE OS SERVIÇOS DESEJADOS
        </span>

        {selectedCount > 0 && (
          <button
            type="button"
            onClick={() => clearSolution(solutionLabel)}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.15em] text-white/50 transition-colors hover:text-brand sm:text-xs sm:tracking-[0.2em]"
          >
            <Trash2 size={14} aria-hidden="true" />
            LIMPAR
          </button>
        )}
      </FadeIn>

      <Stagger
        as="ul"
        staggerDelay={0.04}
        className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
      >
        {servicos.map((servico) => (
          <StaggerItem
            key={servico}
            as="li"
            direction="up"
            distance={10}
            duration={0.2}
            className="h-full"
          >
            <ServiceItem servico={servico} solutionLabel={solutionLabel} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
