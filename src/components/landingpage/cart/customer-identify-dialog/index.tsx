"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-hook-form";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCustomerRegister } from "@/hooks/landingpage/cart/use-customer-register";
import { useDocumentLookup } from "@/hooks/landingpage/cart/use-document-lookup";
import { useCartStore } from "@/store/landingpage/solutions/cart-store";
import { useCustomerIdentifyStore } from "@/store/landingpage/solutions/customer-identify-store";
import { useCustomerStore } from "@/store/landingpage/solutions/customer-store";
import { DocumentStep } from "./document-step";
import { RegisterStep } from "./register-step";

const REGISTER_FORM_ID = "customer-register-form";

export function CustomerIdentifyDialog() {
  const isOpen = useCustomerIdentifyStore((state) => state.isOpen);
  const pendingItem = useCustomerIdentifyStore((state) => state.pendingItem);
  const onIdentified = useCustomerIdentifyStore((state) => state.onIdentified);
  const closeIdentify = useCustomerIdentifyStore((state) => state.close);
  const setCustomer = useCustomerStore((state) => state.setCustomer);
  const addItem = useCartStore((state) => state.addItem);

  const [pendingDocument, setPendingDocument] = useState<string | null>(null);

  function handleResolved(customer: CustomerResponseType) {
    setCustomer(customer);

    if (pendingItem) {
      addItem(pendingItem.segmentId, pendingItem.segmentName, pendingItem.item);
    }

    setPendingDocument(null);
    documentLookup.form.reset();
    customerRegister.form.reset();
    closeIdentify();
    onIdentified?.();
  }

  const documentLookup = useDocumentLookup({
    onFound: handleResolved,
    onNotFound: (document) => setPendingDocument(document),
  });

  const customerRegister = useCustomerRegister({
    document: pendingDocument ?? "",
    onRegistered: handleResolved,
  });

  const { isSubmitting: isRegisterSubmitting } = useFormState({
    control: customerRegister.form.control,
  });

  function handleOpenChange(open: boolean) {
    if (open) return;
    setPendingDocument(null);
    documentLookup.form.reset();
    customerRegister.form.reset();
    closeIdentify();
  }

  return (
    <>
      <Dialog open={isOpen && !pendingDocument} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Identifique-se</DialogTitle>
            <DialogDescription>
              Informe seu CPF ou CNPJ para adicionar o serviço à sua sacola.
            </DialogDescription>
          </DialogHeader>

          <DocumentStep {...documentLookup} />
        </DialogContent>
      </Dialog>

      <Sheet open={isOpen && !!pendingDocument} onOpenChange={handleOpenChange}>
        <SheetContent
          showCloseButton={false}
          className="flex w-full flex-col gap-0 border-white/10 bg-black p-0 sm:max-w-md!"
        >
          <SheetHeader className="flex-row shrink-0 items-start justify-between gap-4 space-y-0 border-b border-white/10 p-4 sm:p-6">
            <div className="flex flex-col gap-1.5">
              <SheetTitle className="font-display text-lg text-white sm:text-xl">
                Finalizar cadastro
              </SheetTitle>
              <SheetDescription className="text-sm text-neutral-400">
                Não encontramos seu cadastro. Preencha seus dados para
                continuar.
              </SheetDescription>
            </div>
            <SheetClose className="cursor-pointer rounded-xs text-white/60 opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-brand">
              <X className="size-4" />
              <span className="sr-only">Fechar</span>
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <RegisterStep {...customerRegister} formId={REGISTER_FORM_ID} />
          </div>

          <SheetFooter className="mt-0 shrink-0 border-t border-white/10 p-3">
            <button
              form={REGISTER_FORM_ID}
              type="submit"
              disabled={isRegisterSubmitting}
              className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98 disabled:pointer-events-none disabled:opacity-60"
            >
              CONCLUIR CADASTRO
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
