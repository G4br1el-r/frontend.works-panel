"use client";

import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { CartSheet } from "@/components/landingpage/cart/cart-sheet";
import { HeaderBag } from "@/components/landingpage/header/header-bag";
import { HeaderLogo } from "@/components/landingpage/header/header-logo";
import { HeaderNav } from "@/components/landingpage/header/header-nav";
import { DEFAULT_EASE } from "@/components/motion/variants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/utils/cn";

const HEADER_SCROLL_THRESHOLD_PX = 24;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrolled(HEADER_SCROLL_THRESHOLD_PX);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: DEFAULT_EASE }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        isScrolled
          ? "border-white/10 bg-black/70 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-10">
        <HeaderLogo className="order-2 lg:order-0" />

        <HeaderNav className="hidden items-center gap-8 lg:flex" />

        <HeaderBag className="order-3 lg:order-0" />

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger
            type="button"
            aria-label="Abrir menu"
            className="order-1 cursor-pointer text-white lg:order-0 lg:hidden"
          >
            <Menu size={24} aria-hidden="true" />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex w-3/4 flex-col gap-8 border-white/10 bg-black px-6 py-8 sm:max-w-xs"
          >
            <SheetHeader className="p-0">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SheetDescription className="sr-only">
                Links de navegação
              </SheetDescription>
            </SheetHeader>

            <HeaderNav
              onLinkClick={() => setIsMenuOpen(false)}
              className="flex flex-col gap-6"
            />
          </SheetContent>
        </Sheet>
      </div>

      <CartSheet />
    </motion.header>
  );
}
