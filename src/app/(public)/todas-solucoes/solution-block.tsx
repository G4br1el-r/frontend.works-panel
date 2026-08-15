import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { SolutionServices } from "@/components/landingpage/solutions/solution-services";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";

interface SolutionBlockProps {
  segment: SegmentResponseType;
  index: number;
}

export function SolutionBlock({ segment, index }: SolutionBlockProps) {
  return (
    <FadeIn
      direction="up"
      distance={16}
      duration={0.5}
      className="border-b border-white/10 pb-14 last:border-b-0 last:pb-0"
    >
      <div className="flex flex-col gap-6 sm:gap-8">
        <SectionHeading
          eyebrow={`SOLUÇÃO ${String(index + 1).padStart(2, "0")}`}
          lines={[segment.name.toUpperCase()]}
        />

        <p className="max-w-3xl text-sm leading-relaxed text-pretty text-white/70 sm:text-base">
          {segment.description}
        </p>

        <SolutionServices
          serviceItems={(segment.serviceItems ?? []).filter(
            (item) => item.active,
          )}
          segmentId={segment.id}
          segmentName={segment.name}
        />
      </div>
    </FadeIn>
  );
}
