import { Quote } from "lucide-react";
import { TestimonialsCarousel } from "@/components/landingpage/testimonials/testimonials-carousel";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="relative w-full scroll-mt-16 overflow-hidden bg-black px-4 py-14 sm:scroll-mt-20 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <Quote
        className="pointer-events-none absolute top-1/2 left-1/2 size-144 -translate-x-1/2 -translate-y-1/2 fill-white/3 text-white/3 sm:size-176 lg:size-208"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl">
        <FadeIn direction="up" distance={16} duration={0.5}>
          <SectionHeading
            eyebrow="DEPOIMENTOS"
            lines={["O QUE DIZEM", "NOSSOS CLIENTES"]}
          />
        </FadeIn>

        <FadeIn
          direction="up"
          distance={24}
          duration={0.6}
          delay={0.15}
          className="mt-10 sm:mt-12 lg:mt-16"
        >
          <TestimonialsCarousel />
        </FadeIn>
      </div>
    </section>
  );
}
