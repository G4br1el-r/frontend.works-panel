import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { HERO_QUOTE_CTA_URL } from "@/utils/constants";

interface HeaderBagProps {
  onClick?: () => void;
  className?: string;
  variant?: "icon" | "full";
}

export function HeaderBag({
  onClick,
  className,
  variant = "icon",
}: HeaderBagProps) {
  if (variant === "full") {
    return (
      <Link
        href={HERO_QUOTE_CTA_URL}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center gap-2 border border-brand/30 bg-brand/10 px-5 py-3 text-xs font-bold tracking-widest text-brand transition-all duration-300 ease-out hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover)",
          className,
        )}
      >
        <ShoppingBag size={18} className="stroke-[1.5]" aria-hidden="true" />
        MINHA SACOLA
      </Link>
    );
  }

  return (
    <Link
      href={HERO_QUOTE_CTA_URL}
      onClick={onClick}
      aria-label="Ver sacola de serviços"
      className={cn(
        "flex size-10 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-300 ease-out hover:scale-105 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-95",
        className,
      )}
    >
      <ShoppingBag size={18} className="stroke-[1.5]" aria-hidden="true" />
    </Link>
  );
}
