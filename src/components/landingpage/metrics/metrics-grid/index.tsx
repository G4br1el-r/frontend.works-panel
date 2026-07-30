import { MetricCard } from "@/components/landingpage/metrics/metric-card";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import {
  METRICS_ANIMATION_DELAY,
  METRICS_ITEMS,
  NOTCHED_CARD_CLIP_PATH,
} from "@/utils/constants";

export function MetricsGrid() {
  return (
    <Stagger
      as="ul"
      staggerDelay={0.1}
      delay={METRICS_ANIMATION_DELAY}
      className="mt-8 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:mt-16 lg:grid-cols-4 xl:mt-20"
    >
      {METRICS_ITEMS.map((metric, index) => (
        <StaggerItem
          key={metric.id}
          as="li"
          direction="up"
          distance={20}
          duration={0.6}
          className="group relative flex min-w-0 flex-col gap-3 overflow-hidden border border-brand/20 bg-black/50 p-4 backdrop-blur-md transition-all duration-500 ease-out hover:border-brand/60 hover:bg-black/70 min-[400px]:p-5 sm:gap-4 sm:p-6 xl:p-7"
          style={{ clipPath: NOTCHED_CARD_CLIP_PATH }}
        >
          <MetricCard
            icon={metric.icon}
            value={metric.value}
            decimals={metric.decimals}
            prefix={metric.prefix}
            suffix={metric.suffix}
            label={metric.label}
            description={metric.description}
            index={index}
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
