import { About } from "@/components/landingpage/about";
import { Hero } from "@/components/landingpage/hero";
import { Marquee } from "@/components/landingpage/marquee";
import { Metrics } from "@/components/landingpage/metrics";
import { Services } from "@/components/landingpage/services";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Marquee />
      {/* <Metrics /> */}
      <About />
      <Services />
    </main>
  );
}
