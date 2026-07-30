import { ImageComponent } from "@/components/shared/ImageComponent";

type SolutionCardProps = {
  title: string;
  description: string;
  image: string;
  index: number;
};

export function SolutionCard({
  title,
  description,
  image,
  index,
}: SolutionCardProps) {
  return (
    <article className="group relative w-full overflow-hidden bg-black h-64 sm:h-72 md:h-80 xl:h-96">
      <ImageComponent
        src={image}
        alt={`Serviço de ${title.toLowerCase()}`}
        classNameWrapper="absolute inset-0"
        classNameImg="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 426px"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

      <div className="absolute inset-0 translate-y-full bg-linear-to-t from-black/80 via-black/40 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0" />

      <span
        className="absolute top-3 right-3 font-display text-5xl leading-none text-white/10 transition-colors duration-500 ease-out group-hover:text-brand sm:top-4 sm:right-4 sm:text-6xl md:text-7xl xl:text-8xl"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:gap-3 sm:p-5 md:p-6">
        <h3 className="font-display text-base tracking-wide text-white text-balance sm:text-lg md:text-xl xl:text-2xl">
          {title}
        </h3>

        <p className="max-h-0 overflow-hidden text-xs leading-relaxed text-pretty text-white/70 opacity-0 transition-all duration-500 ease-out group-hover:max-h-48 group-hover:opacity-100 sm:text-sm">
          {description}
        </p>
      </div>
    </article>
  );
}
