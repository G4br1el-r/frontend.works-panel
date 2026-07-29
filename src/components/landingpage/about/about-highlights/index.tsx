import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ABOUT_HIGHLIGHTS } from "@/utils/constants";

export function AboutHighlights() {
  return (
    <Stagger
      as="ul"
      staggerDelay={0.05}
      className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
    >
      {ABOUT_HIGHLIGHTS.map(({ icon: Icon, text }) => (
        <StaggerItem
          key={text}
          as="li"
          direction="up"
          distance={12}
          duration={0.4}
          className="flex items-start gap-3 text-sm text-neutral-300 sm:text-base"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand">
            <Icon size={16} className="stroke-[1.5]" aria-hidden="true" />
          </span>
          <span className="min-w-0 self-center leading-snug">{text}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
