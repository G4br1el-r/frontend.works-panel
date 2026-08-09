import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RelatedSolutions } from "@/components/landingpage/solutions/related-solutions";
import { SolutionDescription } from "@/components/landingpage/solutions/solution-description";
import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { SITE_NAME } from "@/lib/utils/constants";
import { getSolution } from "@/lib/utils/get-solution";
import { toTitleCase } from "@/lib/utils/to-title-case";

interface SolutionPageProps {
  params: Promise<{ label: string }>;
}

export async function generateMetadata({
  params,
}: SolutionPageProps): Promise<Metadata> {
  const { label } = await params;
  const solution = getSolution(label);

  if (!solution) {
    return {};
  }

  const title = toTitleCase(solution.title);
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description: solution.description,
    alternates: {
      canonical: `/solucoes/${solution.label}`,
    },
    openGraph: {
      title: fullTitle,
      description: solution.description,
      url: `/solucoes/${solution.label}`,
      images: [
        {
          url: solution.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: solution.description,
      images: [solution.image],
    },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { label } = await params;
  const solution = getSolution(label);

  if (!solution) {
    notFound();
  }

  return (
    <main className="w-full">
      <SolutionHero title={solution.title} image={solution.image} />

      <section className="w-full bg-black px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <SolutionDescription description={solution.description} />
          <SolutionServices
            servicos={solution.servicos}
            solutionLabel={solution.label}
          />

          <RelatedSolutions currentLabel={solution.label} />
        </div>
      </section>
    </main>
  );
}
