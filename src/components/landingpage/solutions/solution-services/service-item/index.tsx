"use client";

import { Check, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
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
    <>
      <span
        className={cn(
          "pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-100",
          added && "opacity-100",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-brand via-brand-light to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100",
          added && "scale-x-100",
        )}
        aria-hidden="true"
      />

      <span
        className={cn(
          "relative flex size-9 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-500 ease-out group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-(--shadow-brand-hover) sm:size-10",
          added &&
            "border-brand bg-brand text-black shadow-(--shadow-brand-hover)",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={added ? "check" : "plus"}
            initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.4, rotate: 45, opacity: 0 }}
            transition={{ duration: 0.25, ease: DEFAULT_EASE }}
            className="flex items-center justify-center"
          >
            {added ? (
              <Check size={16} className="stroke-[1.5]" aria-hidden="true" />
            ) : (
              <Plus size={16} className="stroke-[1.5]" aria-hidden="true" />
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      <span
        className={cn(
          "relative min-w-0 flex-1 text-sm leading-snug text-pretty text-white/80 transition-colors duration-500 ease-out group-hover:text-white sm:text-base",
          added && "text-white",
        )}
      >
        {servico}
      </span>

      <motion.button
        type="button"
        onClick={() => toggleItem(solutionLabel, servico)}
        whileTap={{ scale: 0.85 }}
        animate={added ? { scale: [1, 1.15, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: DEFAULT_EASE }}
        aria-pressed={added}
        aria-label={
          added
            ? `Remover ${servico} da sacola`
            : `Adicionar ${servico} à sacola`
        }
        className={cn(
          "relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand/30 text-brand transition-all duration-300 ease-out hover:scale-110 group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-(--shadow-brand-hover) sm:size-8",
          added &&
            "border-brand bg-brand text-black shadow-(--shadow-brand-hover)",
        )}
      >
        {added ? (
          <Check size={15} className="stroke-2" aria-hidden="true" />
        ) : (
          <Plus size={15} className="stroke-2" aria-hidden="true" />
        )}
      </motion.button>
    </>
  );
}
