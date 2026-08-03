import { Plus, ShoppingBag } from "lucide-react";

interface ServiceItemProps {
  servico: string;
}

export function ServiceItem({ servico }: ServiceItemProps) {
  return (
    <>
      <span
        className="pointer-events-none absolute -top-16 -right-16 size-32 rounded-full bg-brand/20 opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-100"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-linear-to-r from-brand via-brand-light to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden="true"
      />

      <span className="relative flex size-9 shrink-0 items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-500 ease-out group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-(--shadow-brand-hover) sm:size-10">
        <ShoppingBag size={16} className="stroke-[1.5]" aria-hidden="true" />
      </span>

      <span className="relative min-w-0 flex-1 text-sm leading-snug text-pretty text-white/80 transition-colors duration-500 ease-out group-hover:text-white sm:text-base">
        {servico}
      </span>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand/30 text-brand transition-all duration-300 ease-out hover:scale-110 group-hover:border-brand group-hover:bg-brand group-hover:text-black group-hover:shadow-(--shadow-brand-hover) sm:size-8"
      >
        <Plus size={15} className="stroke-2" aria-hidden="true" />
      </button>
    </>
  );
}
