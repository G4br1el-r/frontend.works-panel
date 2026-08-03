import { AboutActions } from "@/components/landingpage/home/about/about-actions";
import { AboutDescription } from "@/components/landingpage/home/about/about-description";
import { AboutExperienceBadge } from "@/components/landingpage/home/about/about-experience-badge";
import { AboutHeading } from "@/components/landingpage/home/about/about-heading";
import { AboutHighlights } from "@/components/landingpage/home/about/about-highlights";
import { ImageComponent } from "@/components/shared/ImageComponent";

export function About() {
  return (
    <section
      id="sobre"
      className="relative flex w-full min-h-dvh scroll-mt-16 overflow-hidden sm:scroll-mt-20"
    >
      <ImageComponent
        src="/images/general/drill.jpeg"
        alt="Ferramenta elétrica em uso durante execução de serviço"
        classNameWrapper="h-full w-full absolute inset-0"
        classNameImg="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/85 to-black/70 lg:bg-linear-to-r lg:from-black lg:via-black/70 lg:to-transparent" />

      <div className="relative z-10 flex w-full flex-col items-stretch gap-8 p-4 sm:p-6 md:p-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:p-10">
        <div className="flex w-full flex-col gap-8 border border-brand/20 bg-black/60 px-5 py-8 backdrop-blur-md sm:gap-10 sm:px-8 sm:py-10 lg:w-[58%] lg:px-10 xl:w-[56%] xl:px-12 2xl:w-1/2 2xl:max-w-3xl 2xl:px-15">
          <AboutHeading />
          <AboutDescription />
          <AboutHighlights />
          <AboutActions />
        </div>

        <AboutExperienceBadge />
      </div>
    </section>
  );
}
