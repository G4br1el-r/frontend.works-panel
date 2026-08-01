import { SolutionsGrid } from "@/components/landingpage/solutions/solutions-grid";
import { SolutionsQuoteCta } from "@/components/landingpage/solutions/solutions-quote-cta";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Solutions() {
  return (
    <section
      id="solucoes"
      className="w-full scroll-mt-16 overflow-x-hidden bg-black px-4 py-14 sm:scroll-mt-20 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <FadeIn
          direction="up"
          distance={16}
          duration={0.5}
          className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10"
        >
          <SectionHeading
            eyebrow="O QUE OFERECEMOS"
            lines={["NOSSOS", "SERVIÇOS"]}
          />
          <SolutionsQuoteCta />
        </FadeIn>

        <SolutionsGrid />
      </div>
    </section>
  );
}
