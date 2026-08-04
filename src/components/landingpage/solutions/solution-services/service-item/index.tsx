"use client";

import { Check, Plus } from "lucide-react";
import { motion } from "motion/react";
import { DEFAULT_EASE } from "@/components/motion/variants";
import { useCartStore } from "@/store/landingpage/solutions/cart-store";
import { cn } from "@/utils/cn";

interface ServiceItemProps {
  servico: string;
  solutionLabel: string;
}

export function ServiceItem({ servico, solutionLabel }: ServiceItemProps) {
  const added = useCartStore((state) => state.isInCart(solutionLabel, servico));
  const toggleItem = useCartStore((state) => state.toggleItem);

  return (
    <motion.button
      type="button"
      onClick={() => toggleItem(solutionLabel, servico)}
      whileTap={{ scale: 0.98 }}
      aria-pressed={added}
      aria-label={
        added ? `Remover ${servico} da sacola` : `Adicionar ${servico} à sacola`
      }
      className={cn(
        "group flex h-full w-full cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-white/3 p-4 text-left transition-all duration-300 ease-out hover:border-brand/50 hover:bg-white/6 sm:gap-4 sm:p-5",
        added && "border-brand/40 bg-brand/5",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md border-2 border-white/25 text-transparent transition-all duration-300 ease-out group-hover:border-brand/60 sm:size-6",
          added && "border-brand bg-brand text-black",
        )}
      >
        <Check size={14} className="stroke-3" aria-hidden="true" />
      </span>

      <span
        className={cn(
          "min-w-0 flex-1 text-sm leading-snug text-pretty text-white/80 transition-colors duration-300 ease-out group-hover:text-white sm:text-base",
          added && "text-white",
        )}
      >
        {servico}
      </span>

      <span
        className={cn(
          "flex shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[0.6rem] font-bold whitespace-nowrap tracking-widest transition-all duration-300 ease-out sm:min-w-32 sm:px-4 sm:text-[0.65rem]",
          added
            ? "border-brand bg-brand text-black"
            : "border-brand/30 text-brand transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-black",
        )}
      >
        {added ? (
          <motion.span
            key="added"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: DEFAULT_EASE }}
            className="flex items-center gap-1.5"
          >
            <Check size={12} className="stroke-3" aria-hidden="true" />
            <span className="hidden sm:inline">ADICIONADO</span>
          </motion.span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Plus size={12} className="stroke-3" aria-hidden="true" />
            <span className="hidden sm:inline">ADICIONAR</span>
          </span>
        )}
      </span>
    </motion.button>
  );
}
