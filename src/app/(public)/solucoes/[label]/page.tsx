import { notFound } from "next/navigation";
import { SolutionDescription } from "@/components/landingpage/solutions/solution-description";
import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { getSolution } from "@/utils/get-solution";

interface SolutionPageProps {
  params: Promise<{ label: string }>;
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
        </div>
      </section>
    </main>
  );
}
