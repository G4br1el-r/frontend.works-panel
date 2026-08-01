import { BackgroundVideo } from "@/components/landingpage/hero/background-video";
import { METRICS_BACKGROUND_VIDEO_SOURCES } from "@/utils/constants";

export function MetricsBackground() {
  return (
    <div className="hidden lg:absolute lg:inset-0 lg:block lg:h-full lg:w-full">
      <BackgroundVideo sources={METRICS_BACKGROUND_VIDEO_SOURCES} playOnInView />

      <div
        className="absolute inset-0 bg-radial-[ellipse_at_center] from-black/20 from-5% via-black/60 via-55% to-black to-100% lg:from-black/40 lg:via-black/85"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black to-transparent sm:h-24 lg:h-40 xl:h-48"
        aria-hidden="true"
      />

      <div
        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black to-transparent sm:h-28 lg:h-40 xl:h-48"
        aria-hidden="true"
      />
    </div>
  );
}
