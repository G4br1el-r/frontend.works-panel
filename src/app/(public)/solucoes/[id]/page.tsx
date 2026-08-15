import type { Metadata } from "next";
import { RelatedSolutions } from "@/components/landingpage/solutions/related-solutions";
import { SolutionDescription } from "@/components/landingpage/solutions/solution-description";
import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { getSegmentOrNotFound } from "./get-segment";
import { buildSolutionMetadata } from "./metadata";

interface SolutionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { id } = await params;
  const segment = await getSegmentOrNotFound(id);

  return buildSolutionMetadata(segment);
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { id } = await params;
  const segment = await getSegmentOrNotFound(id);

  return (
    <main className="w-full">
      <SolutionHero
        title={segment.name.toUpperCase()}
        image={segment.coverImage}
      />

      <section className="w-full bg-black px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <SolutionDescription description={segment.description} />
          <SolutionServices
            serviceItems={(segment.serviceItems ?? []).filter(
              (item) => item.active,
            )}
            segmentId={segment.id}
            segmentName={segment.name}
          />

          <RelatedSolutions currentId={segment.id} />
        </div>
      </section>
    </main>
  );
}
