import { About } from "@/components/landingpage/about";
import { CtaBanner } from "@/components/landingpage/cta-banner";
import { Hero } from "@/components/landingpage/hero";
import { Marquee } from "@/components/landingpage/marquee";
import { Metrics } from "@/components/landingpage/metrics";
import { Solutions } from "@/components/landingpage/solutions";
import { Testimonials } from "@/components/landingpage/testimonials";

export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <Marquee />
      <About />
      <Solutions />
      <Metrics />
      <Testimonials />
      <CtaBanner />
    </main>
  );
}
