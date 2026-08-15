"use client";

import { Check, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { DEFAULT_EASE } from "@/components/motion/variants";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddressSelectStore } from "@/store/landingpage/solutions/address-select-store";
import { useCartSheetStore } from "@/store/landingpage/solutions/cart-sheet-store";
import {
  useCartItemCount,
  useCartStore,
} from "@/store/landingpage/solutions/cart-store";
import { useCustomerIdentifyStore } from "@/store/landingpage/solutions/customer-identify-store";
import { useCustomerStore } from "@/store/landingpage/solutions/customer-store";

const SUBMITTED_FEEDBACK_DURATION_MS = 2500;

export function CartSheet() {
  const cart = useCartStore((state) => state.cart);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const itemCount = useCartItemCount();
  const isOpen = useCartSheetStore((state) => state.isOpen);
  const setOpen = useCartSheetStore((state) => state.setOpen);
  const customer = useCustomerStore((state) => state.customer);
  const openIdentifyDialog = useCustomerIdentifyStore((state) => state.open);
  const openAddressSelect = useAddressSelectStore((state) => state.open);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const groups = Object.entries(cart);

  useEffect(() => {
    if (!justSubmitted) return;
    const timeout = setTimeout(
      () => setJustSubmitted(false),
      SUBMITTED_FEEDBACK_DURATION_MS,
    );
    return () => clearTimeout(timeout);
  }, [justSubmitted]);

  const submitQuote = () => {
    setJustSubmitted(true);
    clearCart();
  };

  const chooseAddressThenSubmit = () => {
    openAddressSelect(() => submitQuote());
  };

  const handleSubmitClick = () => {
    if (!customer) {
      openIdentifyDialog({ onIdentified: chooseAddressThenSubmit });
      return;
    }

    chooseAddressThenSubmit();
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) setJustSubmitted(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
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
          <AnimatePresence>
            {justSubmitted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: DEFAULT_EASE }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black px-6 text-center"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4, ease: DEFAULT_EASE }}
                  className="flex size-16 items-center justify-center rounded-full bg-brand text-black shadow-(--shadow-brand-hover)"
                >
                  <Check size={30} className="stroke-3" aria-hidden="true" />
                </motion.span>

                <div className="flex flex-col gap-1">
                  <p className="font-display text-lg text-white">
                    Solicitação enviada!
                  </p>
                  <p className="text-sm text-white/60">
                    Em breve entraremos em contato com o seu orçamento.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {groups.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm text-white/50">
                Navegue pelas soluções e clique no + para adicionar serviços à
                sua sacola.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {groups.map(([segmentId, group]) => (
                <div key={segmentId}>
                  <p className="text-xs font-semibold tracking-widest text-brand">
                    {group.segmentName}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className="group flex items-center justify-between gap-3 border border-brand/20 bg-black/50 px-3 py-2 transition-all duration-300 ease-out hover:border-brand/60 hover:bg-black/70"
                      >
                        <span className="min-w-0 text-sm text-white/80 transition-colors duration-300 ease-out group-hover:text-white">
                          {item.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(Number(segmentId), item.id)}
                          aria-label={`Remover ${item.name} da sacola`}
                          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand/30 text-brand transition-all duration-300 ease-out hover:scale-110 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover)"
                        >
                          <X size={14} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {groups.length > 0 && (
          <SheetFooter>
            <button
              type="button"
              onClick={handleSubmitClick}
              className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:shadow-(--shadow-brand-hover) hover:scale-102 active:scale-98"
            >
              <Send size={14} aria-hidden="true" />
              SOLICITAR ORÇAMENTO
            </button>

            <button
              type="button"
              onClick={clearCart}
              className="flex cursor-pointer items-center justify-center gap-2 border border-brand/30 bg-brand/10 px-4 py-3 text-xs font-semibold tracking-widest text-brand transition-all duration-300 ease-out hover:scale-102 active:scale-98"
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
