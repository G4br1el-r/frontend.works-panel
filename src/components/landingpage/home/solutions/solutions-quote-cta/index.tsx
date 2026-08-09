import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  NOTCHED_BUTTON_CLIP_PATH,
  SOLUTIONS_QUOTE_CTA_URL,
} from "@/lib/utils/constants";

export function SolutionsQuoteCta() {
  return (
    <Link
      href={SOLUTIONS_QUOTE_CTA_URL}
      className="inline-flex w-full shrink-0 items-center justify-center gap-2 border border-brand/30 px-5 py-3 text-center text-[0.7rem] font-bold tracking-widest text-white transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-97 sm:w-auto sm:self-start sm:px-6 sm:text-xs md:self-auto md:text-sm"
      style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
    >
      SOLICITAR ORÇAMENTO
      <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
    </Link>
  );
}
