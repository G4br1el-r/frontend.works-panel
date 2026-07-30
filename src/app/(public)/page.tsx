import { About } from "@/components/landingpage/about";
import { Hero } from "@/components/landingpage/hero";
import { Marquee } from "@/components/landingpage/marquee";
import { Metrics } from "@/components/landingpage/metrics";
import { Solutions } from "@/components/landingpage/solutions";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Marquee />
      <About />
      <Solutions />
      <Metrics />
    </main>
  );
}
