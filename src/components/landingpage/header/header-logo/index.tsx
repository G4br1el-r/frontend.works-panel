"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { cn } from "@/utils/cn";
import { SITE_HEADER_LOGO } from "@/utils/constants";

interface HeaderLogoProps {
  className?: string;
}

export function HeaderLogo({ className }: HeaderLogoProps) {
  const handleClick = useScrollToSection();

  return (
    <Link
      href="#inicio"
      onClick={handleClick}
      aria-label="Ir para o início"
      className={cn("relative block size-11 shrink-0 sm:size-13", className)}
    >
      <Image
        src={SITE_HEADER_LOGO}
        alt="Guilherme Goulart"
        fill
        priority
        sizes="52px"
        className="object-contain"
      />
    </Link>
  );
}
