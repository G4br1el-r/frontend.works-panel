import { About } from "@/components/landingpage/home/about";
import { CtaBanner } from "@/components/landingpage/home/cta-banner";
import { Hero } from "@/components/landingpage/home/hero";
import { Marquee } from "@/components/landingpage/home/marquee";
import { Metrics } from "@/components/landingpage/home/metrics";
import { Solutions } from "@/components/landingpage/home/solutions";
import { Testimonials } from "@/components/landingpage/home/testimonials";

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
