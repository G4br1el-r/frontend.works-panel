"use client";

import { ShoppingBag } from "lucide-react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { useEffect, useRef } from "react";
import { DEFAULT_EASE } from "@/components/motion/variants";
import { useCartSheetStore } from "@/store/landingpage/solutions/cart-sheet-store";
import { useCartItemCount } from "@/store/landingpage/solutions/cart-store";
import { cn } from "@/utils/cn";

interface HeaderBagProps {
  className?: string;
  variant?: "icon" | "full";
}

export function HeaderBag({ className, variant = "icon" }: HeaderBagProps) {
  const itemCount = useCartItemCount();
  const openCart = useCartSheetStore((state) => state.openCart);
  const bumpControls = useAnimationControls();
  const previousCount = useRef(itemCount);

  useEffect(() => {
    if (itemCount > previousCount.current) {
      bumpControls.start({
        scale: [1, 1.3, 0.95, 1],
        rotate: [0, -12, 10, 0],
        transition: { duration: 0.45, ease: DEFAULT_EASE },
      });
    }
    previousCount.current = itemCount;
  }, [itemCount, bumpControls]);

  const icon = (
    <motion.span
      animate={bumpControls}
      className="flex items-center justify-center"
    >
      <ShoppingBag size={18} className="stroke-[1.5]" aria-hidden="true" />
    </motion.span>
  );

  const badgeContent = (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={itemCount}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.2, ease: DEFAULT_EASE }}
      >
        {itemCount}
      </motion.span>
    </AnimatePresence>
  );

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={openCart}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 border border-brand/30 bg-brand/10 px-5 py-3 text-xs font-bold tracking-widest text-brand transition-all duration-300 ease-out hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover)",
          className,
        )}
      >
        {icon}
        MINHA SACOLA
        {itemCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-brand px-1 text-[0.65rem] font-bold text-black">
            {badgeContent}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Ver sacola de serviços"
      className={cn(
        "relative flex size-9 shrink-0 cursor-pointer items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-300 ease-out hover:scale-105 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-95 sm:size-10",
        className,
      )}
    >
      {icon}
      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-4.5 items-center justify-center overflow-hidden rounded-full bg-brand px-1 text-[0.6rem] font-bold text-black">
          {badgeContent}
        </span>
      )}
    </button>
  );
}
