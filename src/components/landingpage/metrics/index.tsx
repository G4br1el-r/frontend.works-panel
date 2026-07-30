import { MetricsBackground } from "@/components/landingpage/metrics/metrics-background";
import { MetricsGrid } from "@/components/landingpage/metrics/metrics-grid";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Metrics() {
  return (
    <section
      id="diferenciais"
      className="relative w-full overflow-hidden bg-black"
    >
      <MetricsBackground />

      <div className="relative z-10 -mt-12 w-full overflow-x-hidden px-4 pb-14 sm:-mt-16 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:mt-0 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <FadeIn direction="up" distance={16} duration={0.5}>
            <SectionHeading
              eyebrow="DIFERENCIAIS"
              lines={["POR QUE", "NOS ESCOLHER"]}
            />
          </FadeIn>

          <MetricsGrid />
        </div>
      </div>
    </section>
  );
}
