"use client";

import { Send, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartSheetStore } from "@/store/landingpage/solutions/cart-sheet-store";
import {
  useCartItemCount,
  useCartStore,
} from "@/store/landingpage/solutions/cart-store";
import { getSolution } from "@/utils/get-solution";

export function CartSheet() {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartItemCount();
  const isOpen = useCartSheetStore((state) => state.isOpen);
  const setOpen = useCartSheetStore((state) => state.setOpen);

  const groups = Object.entries(cart);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-3/4 flex-col border-white/10 bg-black sm:max-w-sm"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingBag size={18} className="text-brand" aria-hidden="true" />
            Sua sacola de serviços
          </SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Nenhum serviço selecionado ainda."
              : `${itemCount} ${itemCount === 1 ? "serviço selecionado" : "serviços selecionados"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="relative flex-1 overflow-y-auto px-4">
          {groups.length === 0 ? (
            <>
              <Image
                src="/images/general/bag-background.jpeg"
                alt=""
                fill
                aria-hidden="true"
                className="object-cover opacity-30"
              />
              <div
                className="absolute inset-0 bg-black/60"
                aria-hidden="true"
              />
              <div className="relative flex h-full items-center justify-center">
                <p className="text-center text-sm text-white/50">
                  Navegue pelas soluções e clique no + para adicionar serviços à
                  sua sacola.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-6">
              {groups.map(([solutionLabel, servicos]) => {
                const solution = getSolution(solutionLabel);
                return (
                  <div key={solutionLabel}>
                    <p className="text-xs font-semibold tracking-widest text-brand">
                      {solution?.title ?? solutionLabel}
                    </p>
                    <ul className="mt-3 flex flex-col gap-2">
                      {servicos.map((servico) => (
                        <li
                          key={servico}
                          className="group flex items-center justify-between gap-3 border border-brand/20 bg-black/50 px-3 py-2 transition-all duration-300 ease-out hover:border-brand/60 hover:bg-black/70"
                        >
                          <span className="text-sm text-white/80 transition-colors duration-300 ease-out group-hover:text-white">
                            {servico}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(solutionLabel, servico)}
                            aria-label={`Remover ${servico} da sacola`}
                            className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand/30 text-brand transition-all duration-300 ease-out hover:scale-110 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover)"
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {groups.length > 0 && (
          <SheetFooter>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:shadow-(--shadow-brand-hover) hover:scale-102 active:scale-98"
            >
              <Send size={14} aria-hidden="true" />
              ENVIAR ORÇAMENTO
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="flex cursor-pointer items-center justify-center gap-2 border border-brand/30 bg-brand/10 px-4 py-3 text-xs font-semibold tracking-widest text-brand transition-all duration-300 ease-out hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover)"
            >
              <Trash2 size={14} aria-hidden="true" />
              LIMPAR SACOLA
            </button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
