import { GetAllSegmentService } from "@/app/services/works-panel/segment/get-all-segment.service";
import { SolutionCard } from "@/components/landingpage/solutions/solution-card";
import { SolutionsEmpty } from "@/components/landingpage/solutions/solutions-empty";
import { FadeIn } from "@/components/motion/fade-in";

export async function SolutionsGrid() {
  const SEGMENTS = await GetAllSegmentService({ active: true });
  const SOLUTIONS_ITEMS = SEGMENTS.filter((segment) =>
    segment.serviceItems?.some((item) => item.active),
  );
  const isSolutionsEmpty = SOLUTIONS_ITEMS.length === 0;

  if (isSolutionsEmpty) {
    return (
      <div className="mt-8 sm:mt-12 lg:mt-16 xl:mt-20">
        <SolutionsEmpty />
      </div>
    );
  }

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
            id={solution.id}
            title={solution.name}
            description={solution.description}
            image={solution.coverImage}
            index={index}
          />
        </FadeIn>
      ))}
    </div>
  );
}
