"use client";

import { LogOut, MapPin, Phone, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContactStore } from "@/store/landingpage/solutions/contact-store";
import { cn } from "@/utils/cn";

interface HeaderAccountProps {
  className?: string;
}

export function HeaderAccount({ className }: HeaderAccountProps) {
  const contact = useContactStore((state) => state.contact);
  const clearContact = useContactStore((state) => state.clearContact);

  if (!contact) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Seus dados salvos"
          className={cn(
            "flex size-9 shrink-0 cursor-pointer items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-300 ease-out hover:scale-105 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-95 sm:size-10",
            className,
          )}
        >
          <User size={18} className="stroke-[1.5]" aria-hidden="true" />
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <p className="text-xs font-semibold tracking-widest text-brand">
          DADOS SALVOS
        </p>

        <p className="mt-3 line-clamp-2 font-display text-base text-white text-balance">
          {contact.name}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          <span className="flex items-center gap-2 text-sm text-white/70">
            <Phone
              size={14}
              className="shrink-0 text-brand"
              aria-hidden="true"
            />
            {contact.phone}
          </span>
          <span className="flex items-center gap-2 text-sm text-white/70">
            <MapPin
              size={14}
              className="shrink-0 text-brand"
              aria-hidden="true"
            />
            {contact.cep}
          </span>
        </div>

        <button
          type="button"
          onClick={clearContact}
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 border border-white/10 px-3 py-2 text-[0.7rem] font-semibold tracking-widest text-white/60 outline-none transition-colors hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand"
        >
          <LogOut size={14} aria-hidden="true" />
          SAIR
        </button>
      </PopoverContent>
    </Popover>
  );
}
