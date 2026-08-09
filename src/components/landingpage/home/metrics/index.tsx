import { MetricsBackground } from "@/components/landingpage/home/metrics/metrics-background";
import { MetricsGrid } from "@/components/landingpage/home/metrics/metrics-grid";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";

export function Metrics() {
  return (
    <section
      id="diferenciais"
      className="relative w-full scroll-mt-16 overflow-hidden bg-black sm:scroll-mt-20"
    >
      <MetricsBackground />

      <div className="relative z-10 w-full overflow-x-hidden px-4 pb-14 sm:px-6 sm:pb-16 md:px-8 md:pb-20 lg:px-10 lg:py-24">
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
