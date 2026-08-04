import { SolutionCard } from "@/components/landingpage/home/solutions/solution-card";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SOLUTIONS_ITEMS } from "@/utils/constants";

const RELATED_SOLUTIONS_COUNT = 3;

interface RelatedSolutionsProps {
  currentLabel: string;
}

export function RelatedSolutions({ currentLabel }: RelatedSolutionsProps) {
  const otherSolutions = SOLUTIONS_ITEMS.filter(
    (solution) => solution.label !== currentLabel,
  ).slice(0, RELATED_SOLUTIONS_COUNT);

  return (
    <div className="mt-16 border-t border-white/10 pt-14 sm:mt-20 sm:pt-16 md:mt-24 md:pt-20">
      <FadeIn direction="up" distance={16} duration={0.5}>
        <SectionHeading eyebrow="CONFIRA TAMBÉM" lines={["OUTRAS SOLUÇÕES"]} />
      </FadeIn>

      <div className="mt-8 grid grid-cols-1 gap-px bg-black sm:mt-10 sm:grid-cols-3">
        {otherSolutions.map((solution, index) => (
          <FadeIn
            key={solution.id}
            direction="up"
            distance={20}
            duration={0.3}
            delay={index * 0.06}
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
      </div>
    </div>
  );
}
