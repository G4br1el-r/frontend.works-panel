"use client";

import { Check, MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { AddAddressSheet } from "@/components/landingpage/cart/add-address-sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";
import { useAddressSelectStore } from "@/store/landingpage/solutions/address-select-store";
import { useCustomerStore } from "@/store/landingpage/solutions/customer-store";

const ADDRESS_TYPE_LABEL: Record<AddressResponseType["type"], string> = {
  RESIDENTIAL: "RESIDENCIAL",
  COMMERCIAL: "COMERCIAL",
};

export function AddressSelectDialog() {
  const isOpen = useAddressSelectStore((state) => state.isOpen);
  const onSelected = useAddressSelectStore((state) => state.onSelected);
  const closeSelect = useAddressSelectStore((state) => state.close);
  const customer = useCustomerStore((state) => state.customer);
  const addAddress = useCustomerStore((state) => state.addAddress);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedId((current) => current ?? customer?.addresses[0]?.id ?? null);
  }, [isOpen, customer]);

  function handleOpenChange(open: boolean) {
    if (open) return;
    setSelectedId(null);
    setIsAdding(false);
    closeSelect();
  }

  function handleConfirm() {
    const address = customer?.addresses.find((item) => item.id === selectedId);
    if (!address) return;

    onSelected?.(address);
    setSelectedId(null);
    setIsAdding(false);
    closeSelect();
  }

  function handleAddressAdded(address: AddressResponseType) {
    addAddress(address);
    setSelectedId(address.id);
    setIsAdding(false);
  }

  if (!customer) return null;

  return (
    <>
      <Dialog open={isOpen && !isAdding} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha o endereço</DialogTitle>
            <DialogDescription>
              Selecione o endereço da obra para essa solicitação.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex flex-col gap-2">
            {customer.addresses.map((address) => {
              const selected = address.id === selectedId;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() => setSelectedId(address.id)}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border p-3 text-left transition-colors",
                    selected
                      ? "border-brand bg-brand/10"
                      : "border-white/10 bg-white/5 hover:border-brand/40",
                  )}
                >
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold tracking-widest text-brand">
                        {ADDRESS_TYPE_LABEL[address.type]}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm text-white">
                      {address.street}, {address.number}
                    </span>
                    <span className="block text-xs text-white/60">
                      {address.neighborhood} — {address.city}
                    </span>
                  </span>
                  {selected && (
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-white/20 px-3 py-2.5 text-xs font-semibold tracking-widest text-white/60 transition-colors hover:border-brand hover:text-brand"
            >
              <Plus size={14} aria-hidden="true" />
              CADASTRAR NOVO ENDEREÇO
            </button>
          </div>

          <DialogFooter>
            <button
              type="button"
              disabled={!selectedId}
              onClick={handleConfirm}
              className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98 disabled:pointer-events-none disabled:opacity-60"
            >
              CONFIRMAR ENDEREÇO
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddAddressSheet
        customerId={customer.id}
        open={isOpen && isAdding}
        onOpenChange={(open) => !open && setIsAdding(false)}
        onAdded={handleAddressAdded}
      />
    </>
  );
}
