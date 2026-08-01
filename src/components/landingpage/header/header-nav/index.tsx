"use client";

import Link from "next/link";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { HEADER_NAV_ITEMS } from "@/utils/constants";

interface HeaderNavProps {
  onLinkClick?: () => void;
  className?: string;
}

export function HeaderNav({ onLinkClick, className }: HeaderNavProps) {
  const handleClick = useScrollToSection(onLinkClick);

  return (
    <nav className={className}>
      {HEADER_NAV_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          onClick={handleClick}
          className="group relative text-sm font-semibold tracking-wide text-neutral-200 transition-colors hover:text-brand-light"
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 ease-out group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
}
