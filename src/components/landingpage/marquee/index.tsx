import { MARQUEE_SERVICES } from "@/utils/constants";

function MarqueeTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-6" aria-hidden={ariaHidden || undefined}>
      {MARQUEE_SERVICES.map((service) => (
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
  return (
    <div className="overflow-hidden border-y border-brand/10 bg-black py-4">
      <div className="animate-marquee flex w-max motion-reduce:animate-none">
        <MarqueeTrack />
        <MarqueeTrack ariaHidden />
      </div>
    </div>
  );
}
