import { BackgroundVideo } from "@/components/landingpage/hero/background-video";
import { BrandWordmark } from "@/components/landingpage/hero/brand-wordmark";
import { ScrollIndicator } from "@/components/landingpage/hero/scroll-indicator";

export function Hero() {
  return (
    <section className="relative h-dvh w-full overflow-hidden bg-black">
      <BackgroundVideo />

      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-transparent to-black/80" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 sm:px-6 ">
        <BrandWordmark />
      </div>

      <ScrollIndicator targetId="solucoes" />
    </section>
  );
}
