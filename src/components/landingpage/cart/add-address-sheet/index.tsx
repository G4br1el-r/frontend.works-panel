"use client";

import { X } from "lucide-react";
import { useFormState } from "react-hook-form";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { AddressFormFields } from "@/components/landingpage/cart/address-form-fields";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddAddress } from "@/hooks/landingpage/cart/use-add-address";

const ADD_ADDRESS_FORM_ID = "add-address-form";

interface AddAddressSheetProps {
  customerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: (address: AddressResponseType) => void;
}

export function AddAddressSheet({
  customerId,
  open,
  onOpenChange,
  onAdded,
}: AddAddressSheetProps) {
  const addressForm = useAddAddress({
    customerId,
    onAdded: (address) => {
      onOpenChange(false);
      onAdded(address);
    },
  });
  const { isSubmitting } = useFormState({ control: addressForm.form.control });

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) addressForm.form.reset();
    onOpenChange(nextOpen);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-white/10 bg-black p-0 sm:max-w-md!"
      >
        <SheetHeader className="flex-row shrink-0 items-start justify-between gap-4 space-y-0 border-b border-white/10 p-4 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <SheetTitle className="font-display text-lg text-white sm:text-xl">
              Novo endereço
            </SheetTitle>
            <SheetDescription className="text-sm text-neutral-400">
              Cadastre outro endereço de obra para usar nos seus pedidos.
            </SheetDescription>
          </div>
          <SheetClose className="cursor-pointer rounded-xs text-white/60 opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-brand">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <AddressFormFields {...addressForm} formId={ADD_ADDRESS_FORM_ID} />
        </div>

        <SheetFooter className="mt-0 shrink-0 border-t border-white/10 p-3">
          <button
            form={ADD_ADDRESS_FORM_ID}
            type="submit"
            disabled={isSubmitting}
            className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98 disabled:pointer-events-none disabled:opacity-60"
          >
            CADASTRAR ENDEREÇO
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
