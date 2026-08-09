import type { Metadata } from "next";
import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  ALL_SOLUTIONS_URL,
  SITE_NAME,
  SOLUTIONS_ITEMS,
  SOLUTIONS_MORE_CARD,
} from "@/lib/utils/constants";

const TITLE = "Todos os Serviços";
const DESCRIPTION =
  "Confira a lista completa de serviços: elétrica, hidráulica, alvenaria, pintura, marcenaria, drywall, revestimentos, manutenção predial e muito mais.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: ALL_SOLUTIONS_URL,
  },
  openGraph: {
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    url: ALL_SOLUTIONS_URL,
    images: [
      {
        url: SOLUTIONS_MORE_CARD.image,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    images: [SOLUTIONS_MORE_CARD.image],
  },
};

export default function AllSolutionsPage() {
  return (
    <main className="w-full">
      <SolutionHero
        title="TODOS OS SERVIÇOS"
        image={SOLUTIONS_MORE_CARD.image}
      />

      <section className="w-full bg-black px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 sm:gap-16 md:gap-20">
          {SOLUTIONS_ITEMS.map((solution, index) => (
            <FadeIn
              key={solution.id}
              direction="up"
              distance={16}
              duration={0.5}
              className="border-b border-white/10 pb-14 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col gap-6 sm:gap-8">
                <SectionHeading
                  eyebrow={`SOLUÇÃO ${String(index + 1).padStart(2, "0")}`}
                  lines={[solution.title]}
                />

                <p className="max-w-3xl text-sm leading-relaxed text-pretty text-white/70 sm:text-base">
                  {solution.description}
                </p>

                <SolutionServices
                  servicos={solution.servicos}
                  solutionLabel={solution.label}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  );
}
