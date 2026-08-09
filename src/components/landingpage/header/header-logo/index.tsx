"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollToSection } from "@/hooks/shared/use-scroll-to-section";
import { cn } from "@/lib/utils/cn";
import { SITE_HEADER_LOGO } from "@/lib/utils/constants";

interface HeaderLogoProps {
  className?: string;
}

export function HeaderLogo({ className }: HeaderLogoProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const handleClick = useScrollToSection();

  return (
    <Link
      href={isHome ? "#inicio" : "/#inicio"}
      onClick={isHome ? handleClick : undefined}
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
