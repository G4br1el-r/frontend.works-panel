import { FadeIn } from "@/components/motion/fade-in";
import { ImageComponent } from "@/components/shared/ImageComponent";
import { SectionHeading } from "@/components/shared/SectionHeading";

interface SolutionHeroProps {
  title: string;
  image: string;
}

export function SolutionHero({ title, image }: SolutionHeroProps) {
  return (
    <section className="relative h-72 w-full overflow-hidden bg-black sm:h-80 md:h-120">
      <ImageComponent
        src={image}
        alt={`Serviço de ${title.toLowerCase()}`}
        classNameWrapper="absolute inset-0"
        classNameImg="object-cover"
        sizes="100vw"
        priority
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/20" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-6 sm:pb-10 md:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-7xl">
          <FadeIn onMount direction="up" distance={16} duration={0.6}>
            <SectionHeading eyebrow="SERVIÇO" lines={[title]} />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
