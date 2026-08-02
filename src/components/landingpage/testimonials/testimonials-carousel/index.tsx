"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/landingpage/testimonials/testimonial-card";
import { cn } from "@/utils/cn";
import { TESTIMONIALS_ITEMS } from "@/utils/constants";

export function TestimonialsCarousel() {
  const autoplay = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [autoplay.current],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setSelectedIndex(api.selectedScrollSnap());
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 sm:gap-10">
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
        <button
          type="button"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          aria-label="Depoimento anterior"
          className="hidden shrink-0 cursor-pointer items-center justify-center border border-brand/30 p-2.5 text-brand transition-all duration-300 ease-out hover:border-brand hover:bg-brand hover:text-black disabled:pointer-events-none disabled:opacity-30 sm:flex"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS_ITEMS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-0 shrink-0 basis-full px-1 sm:px-4"
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  name={testimonial.name}
                  role={testimonial.role}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={scrollNext}
          disabled={!canScrollNext}
          aria-label="Próximo depoimento"
          className="hidden shrink-0 cursor-pointer items-center justify-center border border-brand/30 p-2.5 text-brand transition-all duration-300 ease-out hover:border-brand hover:bg-brand hover:text-black disabled:pointer-events-none disabled:opacity-30 sm:flex"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2">
        {TESTIMONIALS_ITEMS.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            onClick={() => scrollTo(index)}
            aria-label={`Ir para depoimento de ${testimonial.name}`}
            className={cn(
              "size-2 cursor-pointer rounded-full transition-all duration-300 ease-out",
              index === selectedIndex
                ? "w-6 bg-brand"
                : "bg-white/15 hover:bg-white/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
