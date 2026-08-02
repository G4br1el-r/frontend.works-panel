import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CautionStripe } from "@/components/landingpage/cta-banner/caution-stripe";
import { FadeIn } from "@/components/motion/fade-in";
import {
  NOTCHED_BUTTON_CLIP_PATH,
  SOLUTIONS_QUOTE_CTA_URL,
} from "@/utils/constants";

export function CtaBanner() {
  return (
    <section className="relative mb-5 w-full overflow-hidden bg-black">
      <CautionStripe />

      <div className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
        <FadeIn
          direction="up"
          distance={16}
          duration={0.5}
          className="mx-auto flex w-full max-w-7xl flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-[0.2em] text-brand sm:text-sm">
              SUA OBRA NÃO PODE ESPERAR
            </span>

            <h2 className="font-display text-2xl leading-tight text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
              DO PROJETO À ENTREGA.
            </h2>
          </div>

          <Link
            href={SOLUTIONS_QUOTE_CTA_URL}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-6 py-3.5 text-center text-xs font-bold tracking-widest text-black transition-all duration-300 ease-in-out hover:shadow-(--shadow-brand-hover) hover:scale-104 active:scale-97 sm:text-sm md:w-auto md:px-8"
            style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
          >
            SOLICITAR ORÇAMENTO
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </Link>
        </FadeIn>
      </div>

      <CautionStripe />
    </section>
  );
}
