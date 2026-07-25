"use client";

import { ArrowRight, BadgeCheck, Clock, Gem, Handshake, Home as HomeIcon, MapPin, ScrollText } from "lucide-react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { ImageComponent } from "@/components/shared/ImageComponent";

const HIGHLIGHTS = [
  { icon: HomeIcon, text: "Atendimento residencial e empresarial" },
  { icon: Clock, text: "Do reparo pontual à obra completa" },
  { icon: ScrollText, text: "Orçamento sem compromisso" },
  { icon: Handshake, text: "Compromisso com prazo em todo projeto" },
  { icon: BadgeCheck, text: "Mais de 20 anos de experiência" },
  { icon: Gem, text: "Materiais de qualidade garantida" },
  { icon: BadgeCheck, text: "Serviço com garantia" },
  { icon: MapPin, text: "Atendimento em toda a região" },
];

const CTA_CLIP_PATH = "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)";

const BADGE_CLIP_PATH = "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

function useExperienceCount() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value) => `${Math.round(value)}+`);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, 20, {
      duration: 1.6,
      delay: 0.3,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [isInView, count]);

  return { ref, rounded };
}

export function About() {
  const { ref: countRef, rounded } = useExperienceCount();

  return (
    <section
      ref={countRef}
      className="relative flex w-full flex-col overflow-hidden bg-black lg:min-h-dvh lg:flex-row lg:items-center"
    >
      <div className="absolute inset-0">
        <ImageComponent
          src="/images/drill.jpeg"
          alt="Ferramenta elétrica em uso durante execução de serviço"
          classNameWrapper="h-full w-full"
          classNameImg="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/85 to-black/30 lg:from-black lg:via-black/70 lg:to-transparent" />
      </div>

      <motion.div
        {...fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex w-full flex-col gap-5 border-y border-brand/20 bg-black/60 px-4 py-6 backdrop-blur-md sm:m-8 sm:border sm:px-10 sm:py-10 md:mx-auto md:max-w-2xl lg:mx-12 lg:max-w-none lg:w-208 lg:px-14 lg:py-10"
      >
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.25em] text-brand sm:text-sm">QUEM SOMOS</span>

          <h2 className="font-display text-2xl leading-tight text-white sm:text-4xl md:text-5xl">
            TRANSFORMANDO PROJETOS EM RESULTADOS SÓLIDOS
          </h2>

          <div className="h-px w-16 bg-brand" />
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
            Com mais de 20 anos de experiência dedicados à prestação de serviços, construímos uma trajetória sólida
            atendendo residências e empresas com excelência, comprometimento e atenção aos detalhes que fazem toda a
            diferença.
          </p>

          <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
            Especialistas em múltiplas frentes — da elétrica à alvenaria, da pintura à marcenaria — oferecemos uma
            solução completa para quem busca praticidade sem abrir mão da qualidade.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {HIGHLIGHTS.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.4,
                delay: 0.3 + i * 0.05,
                ease: "easeOut",
              }}
              className="flex items-start gap-3 text-sm text-neutral-300 sm:text-base"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand">
                <Icon size={16} className="stroke-[1.5]" aria-hidden="true" />
              </span>
              <span className="pt-1.5 leading-snug">{text}</span>
            </motion.li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-4 pt-2 sm:gap-6">
          <motion.a
            href="/orcamento"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-5 py-2.5 text-sm font-bold tracking-widest text-black transition-shadow duration-300 hover:shadow-(--shadow-brand-hover) sm:px-6 sm:py-3"
            style={{ clipPath: CTA_CLIP_PATH }}
          >
            FALE CONOSCO
            <ArrowRight size={16} aria-hidden="true" />
          </motion.a>

          <a
            href="#servicos"
            className="group inline-flex items-center gap-2 text-sm font-semibold tracking-widest text-brand-light transition-colors hover:text-brand"
          >
            NOSSOS SERVIÇOS
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="flex w-fit items-center gap-3 border border-brand/30 bg-black/70 px-4 py-3 text-left backdrop-blur-md lg:hidden"
          style={{ clipPath: BADGE_CLIP_PATH }}
        >
          <motion.span className="font-display text-2xl leading-none text-white sm:text-3xl">{rounded}</motion.span>
          <span className="max-w-28 text-[10px] font-semibold leading-tight tracking-widest text-neutral-300 sm:text-xs">
            ANOS DE EXPERIÊNCIA
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="absolute right-8 bottom-8 hidden w-40 flex-col items-center gap-1 border border-brand/30 bg-black/70 px-5 py-6 text-center backdrop-blur-md lg:flex"
        style={{ clipPath: BADGE_CLIP_PATH }}
      >
        <motion.span className="font-display text-4xl leading-none text-white">{rounded}</motion.span>
        <span className="text-xs font-semibold leading-tight tracking-widest text-neutral-300">
          ANOS DE
          <br />
          EXPERIÊNCIA
        </span>
        <div className="mt-1 h-px w-8 bg-brand" />
      </motion.div>
    </section>
  );
}
