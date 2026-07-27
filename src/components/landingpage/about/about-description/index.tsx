import { FadeIn } from "@/components/motion/fade-in";

export function AboutDescription() {
  return (
    <FadeIn
      direction="up"
      distance={16}
      duration={0.5}
      delay={0.1}
      className="flex flex-col gap-3"
    >
      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
        Com mais de 20 anos de experiência dedicados à prestação de serviços,
        construímos uma trajetória sólida atendendo residências e empresas com
        excelência, comprometimento e atenção aos detalhes que fazem toda a
        diferença.
      </p>

      <p className="text-sm leading-relaxed text-neutral-300 sm:text-base">
        Especialistas em múltiplas frentes — da elétrica à alvenaria, da pintura
        à marcenaria — oferecemos uma solução completa para quem busca
        praticidade sem abrir mão da qualidade.
      </p>
    </FadeIn>
  );
}
