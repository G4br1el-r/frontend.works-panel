"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollToSection } from "@/hooks/shared/use-scroll-to-section";
import { HEADER_NAV_ITEMS } from "@/lib/utils/constants";

interface HeaderNavProps {
  onLinkClick?: () => void;
  className?: string;
}

export function HeaderNav({ onLinkClick, className }: HeaderNavProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const handleClick = useScrollToSection(onLinkClick);

  return (
    <nav className={className}>
      {HEADER_NAV_ITEMS.map((item) => (
        <Link
          key={item.id}
          href={isHome ? item.href : `/${item.href}`}
          onClick={isHome ? handleClick : onLinkClick}
          className="group relative text-sm font-semibold tracking-wide text-neutral-200 transition-colors hover:text-brand-light"
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 ease-out group-hover:w-full" />
        </Link>
      ))}
    </nav>
  );
}
