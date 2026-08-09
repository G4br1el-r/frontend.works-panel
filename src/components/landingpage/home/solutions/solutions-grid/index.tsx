import { SolutionCard } from "@/components/landingpage/home/solutions/solution-card";
import { SolutionsMoreCard } from "@/components/landingpage/home/solutions/solutions-more-card";
import { FadeIn } from "@/components/motion/fade-in";
import { SOLUTIONS_ITEMS } from "@/lib/utils/constants";

export function SolutionsGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-px bg-black sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:mt-20">
      {SOLUTIONS_ITEMS.map((solution, index) => (
        <FadeIn
          key={solution.id}
          direction="up"
          distance={20}
          duration={0.3}
          delay={index * 0.04}
          viewportMargin="0px 0px -10% 0px"
        >
          <SolutionCard
            label={solution.label}
            title={solution.title}
            description={solution.description}
            image={solution.image}
            index={index}
          />
        </FadeIn>
      ))}

      <FadeIn
        direction="up"
        distance={20}
        duration={0.3}
        delay={SOLUTIONS_ITEMS.length * 0.04}
        viewportMargin="0px 0px -10% 0px"
        className="sm:col-span-2 lg:col-span-1"
      >
        <SolutionsMoreCard />
      </FadeIn>
    </div>
  );
}
