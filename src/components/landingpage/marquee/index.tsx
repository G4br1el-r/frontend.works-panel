"use client";

import { useEffect, useRef, useState } from "react";

const SERVICES = [
  "ELÉTRICA",
  "ALVENARIA E OBRA",
  "PINTURA",
  "HIDRÁULICA",
  "MARCENARIA",
  "ATENDIMENTO RESIDENCIAL E EMPRESARIAL",
  "GESSO E DRYWALL",
  "REVESTIMENTOS",
  "+20 ANOS DE EXPERIÊNCIA",
  "MANUTENÇÃO PREDIAL",
  "MONTAGEM E INSTALAÇÃO",
  "ORÇAMENTO SEM COMPROMISSO",
  "REFORMAS",
  "COMPROMISSO COM PRAZO",
  "DO REPARO À OBRA COMPLETA",
];

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center gap-6">
      {SERVICES.map((service) => (
        <span
          key={service}
          className="flex items-center gap-6 whitespace-nowrap text-sm font-medium tracking-[0.2em] text-brand/80 sm:text-base"
        >
          {service}
          <span className="text-brand-deep/60" aria-hidden="true">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden border-y border-brand/10 bg-black py-4">
      <div
        className="animate-marquee flex w-max motion-reduce:animate-none"
        style={{ animationPlayState: isVisible ? "running" : "paused" }}
      >
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
    </div>
  );
}
