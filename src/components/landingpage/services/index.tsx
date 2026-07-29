import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ImageComponent } from "@/components/shared/ImageComponent";
import {
  NOTCHED_BUTTON_CLIP_PATH,
  SERVICES_ITEMS,
  SERVICES_MORE_CARD,
  SERVICES_QUOTE_CTA_URL,
} from "@/utils/constants";

const CARD_HEIGHT = "h-64 sm:h-72 md:h-80 xl:h-96";

const CARD_NUMBER =
  "absolute top-3 right-3 font-display text-5xl leading-none text-white/10 transition-colors duration-500 ease-out group-hover:text-brand sm:top-4 sm:right-4 sm:text-6xl md:text-7xl xl:text-8xl";

const CARD_OVERLAY =
  "absolute inset-0 translate-y-full bg-linear-to-t from-black/80 via-black/40 to-transparent transition-transform duration-500 ease-out group-hover:translate-y-0";

const CARD_TITLE =
  "font-display text-base tracking-wide text-white text-balance sm:text-lg md:text-xl xl:text-2xl";

export function Services() {
  return (
    <section
      id="servicos"
      className="w-full overflow-x-hidden bg-black px-4 py-14 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl">
        <FadeIn
          direction="up"
          distance={16}
          duration={0.5}
          className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10"
        >
          <div className="flex flex-col gap-2 sm:gap-3">
            <span className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-xs md:text-sm md:tracking-[0.25em]">
              <span
                className="animate-services-dot size-1.5 shrink-0 rounded-full bg-brand motion-reduce:animate-none"
                aria-hidden="true"
              />
              O QUE OFERECEMOS
            </span>

            <h2 className="font-display text-[2rem] leading-none text-white sm:text-5xl md:text-6xl xl:text-7xl">
              NOSSOS
              <br />
              SERVIÇOS
            </h2>
          </div>

          <a
            href={SERVICES_QUOTE_CTA_URL}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 border border-brand/30 px-5 py-3 text-center text-[0.7rem] font-bold tracking-widest text-white transition-all duration-300 ease-in-out hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-97 sm:w-auto sm:self-start sm:px-6 sm:text-xs md:self-auto md:text-sm"
            style={{ clipPath: NOTCHED_BUTTON_CLIP_PATH }}
          >
            SOLICITAR ORÇAMENTO
            <ArrowRight size={16} className="shrink-0" aria-hidden="true" />
          </a>
        </FadeIn>

        <div className="mt-8 grid grid-cols-1 gap-px bg-black sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:mt-20">
          {SERVICES_ITEMS.map((service, index) => (
            <FadeIn
              key={service.id}
              direction="up"
              distance={20}
              duration={0.5}
              delay={index * 0.08}
            >
              <article
                className={`group relative w-full overflow-hidden bg-black ${CARD_HEIGHT}`}
              >
                <ImageComponent
                  src={service.image}
                  alt={`Serviço de ${service.title.toLowerCase()}`}
                  classNameWrapper="absolute inset-0"
                  classNameImg="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 426px"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

                <div className={CARD_OVERLAY} />

                <span className={CARD_NUMBER} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:gap-3 sm:p-5 md:p-6">
                  <h3 className={CARD_TITLE}>{service.title}</h3>

                  <p className="max-h-0 overflow-hidden text-xs leading-relaxed text-pretty text-white/70 opacity-0 transition-all duration-500 ease-out group-hover:max-h-48 group-hover:opacity-100 sm:text-sm">
                    {service.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}

          <FadeIn
            direction="up"
            distance={20}
            duration={0.5}
            delay={SERVICES_ITEMS.length * 0.08}
            className="sm:col-span-2 lg:col-span-1"
          >
            <a
              href={SERVICES_QUOTE_CTA_URL}
              className={`group relative flex w-full flex-col justify-end gap-2 overflow-hidden bg-black p-4 sm:gap-3 sm:p-5 md:p-6 ${CARD_HEIGHT}`}
            >
              <ImageComponent
                src={SERVICES_MORE_CARD.image}
                alt="Outros serviços executados pela equipe"
                classNameWrapper="absolute inset-0"
                classNameImg="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 426px"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />

              <div className={CARD_OVERLAY} />

              <span className={CARD_NUMBER} aria-hidden="true">
                +
              </span>

              <div className="relative flex flex-col gap-2 transition-transform duration-500 ease-out group-hover:-translate-y-2 sm:gap-3">
                <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-brand sm:text-xs sm:tracking-[0.25em]">
                  {SERVICES_MORE_CARD.eyebrow}
                </span>

                <h3 className={CARD_TITLE}>{SERVICES_MORE_CARD.title}</h3>

                <p className="text-xs leading-relaxed text-pretty text-white/70 sm:text-sm">
                  {SERVICES_MORE_CARD.description}
                </p>

                <span className="inline-flex items-center gap-2 pt-1 text-[0.7rem] font-bold tracking-widest text-brand-light transition-colors group-hover:text-white sm:text-xs md:text-sm">
                  {SERVICES_MORE_CARD.cta}
                  <ArrowRight
                    size={16}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
