import { AboutRule } from "@/components/landingpage/about/about-rule";
import { FadeIn } from "@/components/motion/fade-in";

export function AboutHeading() {
  return (
    <FadeIn
      direction="up"
      distance={16}
      duration={0.5}
      className="flex flex-col gap-3"
    >
      <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-sm sm:tracking-[0.25em]">
        QUEM SOMOS
      </span>

      <h2 className="font-display text-xl leading-tight text-balance text-white sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl">
        TRANSFORMANDO PROJETOS EM RESULTADOS SÓLIDOS
      </h2>

      <AboutRule />
    </FadeIn>
  );
}
