import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { METRICS_ITEMS } from "@/utils/constants";

export function Metrics() {
  return (
    <section className="px-4  py-16 sm:py-24 relative w-full">
      <Stagger
        staggerDelay={0.1}
        className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 text-center sm:grid-cols-4"
      >
        {METRICS_ITEMS.map((metric) => (
          <StaggerItem
            key={metric.id}
            direction="up"
            distance={20}
            duration={0.6}
          >
            <p className="font-display text-4xl text-brand-light sm:text-6xl">
              {metric.value}
            </p>
            <p className="mt-2 text-xs tracking-[0.2em] text-neutral-400 sm:text-sm">
              {metric.label}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
