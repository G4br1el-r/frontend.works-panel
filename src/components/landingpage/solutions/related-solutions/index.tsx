import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { SolutionCard } from "@/components/landingpage/solutions/solution-card";
import { SolutionsViewAllCta } from "@/components/landingpage/solutions/solutions-view-all-cta";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";

const RELATED_SOLUTIONS_COUNT = 3;

interface RelatedSolutionsProps {
  currentId: number;
}

export async function RelatedSolutions({ currentId }: RelatedSolutionsProps) {
  const segments = await GetAllSegmentService({ active: true });
  const otherSolutions = segments
    .filter(
      (segment) =>
        segment.id !== currentId &&
        segment.serviceItems?.some((item) => item.active),
    )
    .slice(0, RELATED_SOLUTIONS_COUNT);

  if (otherSolutions.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-white/10 pt-14 sm:mt-20 sm:pt-16 md:mt-24 md:pt-20">
      <FadeIn
        direction="up"
        distance={16}
        duration={0.5}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-10"
      >
        <SectionHeading eyebrow="CONFIRA TAMBÉM" lines={["OUTRAS SOLUÇÕES"]} />
        <SolutionsViewAllCta />
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
              id={solution.id}
              title={solution.name}
              description={solution.description}
              image={solution.coverImage}
              index={index}
            />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
