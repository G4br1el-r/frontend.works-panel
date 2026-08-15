import type { Metadata } from "next";
import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionsEmpty } from "@/components/landingpage/solutions/solutions-empty";
import {
  ALL_SOLUTIONS_URL,
  SITE_NAME,
  SOLUTIONS_MORE_CARD,
} from "@/lib/utils/constants";
import { SolutionBlock } from "./solution-block";

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

export default async function AllSolutionsPage() {
  const SEGMENTS = await GetAllSegmentService({ active: true });
  const SOLUTIONS_ITEMS = SEGMENTS.filter((segment) =>
    segment.serviceItems?.some((item) => item.active),
  );
  const isSolutionsEmpty = SOLUTIONS_ITEMS.length === 0;

  return (
    <main className="w-full">
      <SolutionHero
        title="TODOS OS SERVIÇOS"
        image={SOLUTIONS_MORE_CARD.image}
      />

      <section className="w-full bg-black px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-14 sm:gap-16 md:gap-20">
          {isSolutionsEmpty ? (
            <SolutionsEmpty />
          ) : (
            SOLUTIONS_ITEMS.map((segment, index) => (
              <SolutionBlock key={segment.id} segment={segment} index={index} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
