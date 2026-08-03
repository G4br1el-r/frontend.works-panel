import { SolutionHero } from "@/components/landingpage/solutions/solution-hero";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SOLUTIONS_ITEMS, SOLUTIONS_MORE_CARD } from "@/utils/constants";

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
              <div className="flex flex-col gap-6 p-6 sm:gap-8 sm:p-8 md:p-10">
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
