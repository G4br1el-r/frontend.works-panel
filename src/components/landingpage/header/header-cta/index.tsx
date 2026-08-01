import Link from "next/link";
import { cn } from "@/utils/cn";
import {
  HERO_QUOTE_CTA_URL,
  NOTCHED_BUTTON_CLIP_PATH,
} from "@/utils/constants";

interface HeaderCtaProps {
  onClick?: () => void;
  className?: string;
}

export function HeaderCta({ onClick, className }: HeaderCtaProps) {
  return (
    <Link
      href={HERO_QUOTE_CTA_URL}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap bg-linear-to-r from-brand-light via-brand to-brand-deep px-5 py-2.5 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-in-out hover:shadow-(--shadow-brand-hover) hover:scale-104 active:scale-97",
        className,
      )}
      style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
    >
      SOLICITAR ORÇAMENTO
    </Link>
  );
}
