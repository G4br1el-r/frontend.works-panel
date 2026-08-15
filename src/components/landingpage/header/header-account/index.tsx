"use client";

import {
  LogOut,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { AddAddressSheet } from "@/components/landingpage/cart/add-address-sheet";
import { EditAddressSheet } from "@/components/landingpage/cart/edit-address-sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import { useCustomerStore } from "@/store/landingpage/solutions/customer-store";

const ADDRESS_TYPE_LABEL: Record<AddressResponseType["type"], string> = {
  RESIDENTIAL: "RESIDENCIAL",
  COMMERCIAL: "COMERCIAL",
};

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

async function deleteAddress(customerId: number, addressId: number) {
  const response = await fetch(
    `/api/landingpage/customer/${customerId}/address/${addressId}`,
    { method: "DELETE" },
  );

  if (!response.ok) {
    throw new Error("Falha ao excluir endereço");
  }
}

interface HeaderAccountProps {
  className?: string;
}

export function HeaderAccount({ className }: HeaderAccountProps) {
  const customer = useCustomerStore((state) => state.customer);
  const addAddress = useCustomerStore((state) => state.addAddress);
  const updateAddress = useCustomerStore((state) => state.updateAddress);
  const removeAddress = useCustomerStore((state) => state.removeAddress);
  const clearCustomer = useCustomerStore((state) => state.clearCustomer);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressResponseType | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!customer) return null;

  const canDelete = customer.addresses.length > 1;

  async function handleDelete(addressId: number) {
    if (!customer) return;

    setDeletingId(addressId);

    try {
      await toast.promise(deleteAddress(customer.id, addressId), {
        loading: "Excluindo endereço...",
        success: "Endereço excluído.",
        error: "Não foi possível excluir o endereço.",
      });
      removeAddress(addressId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Seus dados salvos"
            className={cn(
              "flex size-9 shrink-0 cursor-pointer items-center justify-center border border-brand/30 bg-brand/10 text-brand transition-all duration-300 ease-out hover:scale-105 hover:border-brand hover:bg-brand hover:text-black hover:shadow-(--shadow-brand-hover) active:scale-95 sm:size-10",
              className,
            )}
          >
            <User size={18} className="stroke-[1.5]" aria-hidden="true" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80">
          <p className="text-xs font-semibold tracking-widest text-brand">
            DADOS SALVOS
          </p>

          <p className="mt-3 line-clamp-2 font-display text-base text-white text-balance">
            {customer.name}
          </p>

          <span className="mt-3 flex items-center gap-2 text-sm text-white/70">
            <Phone
              size={14}
              className="shrink-0 text-brand"
              aria-hidden="true"
            />
            {formatPhone(customer.cellPhone)}
          </span>

          <div className="mt-3 flex max-h-64 flex-col gap-2 overflow-y-auto border-t border-white/10 pt-3">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start gap-2 border border-white/10 bg-white/5 p-2.5"
              >
                <MapPin
                  size={14}
                  className="mt-0.5 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[0.65rem] font-semibold tracking-widest text-brand">
                    {ADDRESS_TYPE_LABEL[address.type]}
                  </span>
                  <p className="mt-0.5 text-sm text-white">
                    {address.street}, {address.number}
                  </p>
                  <p className="text-xs text-white/60">
                    {address.neighborhood} — {address.city}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    aria-label="Editar endereço"
                    onClick={() => setAddressToEdit(address)}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-brand/10 hover:text-brand"
                  >
                    <Pencil size={12} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Excluir endereço"
                    title={
                      !canDelete
                        ? "Cadastre outro endereço antes de excluir este"
                        : undefined
                    }
                    disabled={!canDelete || deletingId === address.id}
                    onClick={() => handleDelete(address.id)}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-30"
                  >
                    <Trash2 size={12} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsAddAddressOpen(true)}
            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 border border-brand/30 bg-brand/10 px-3 py-2 text-[0.7rem] font-semibold tracking-widest text-brand outline-none transition-colors hover:bg-brand hover:text-black focus-visible:bg-brand focus-visible:text-black"
          >
            <Plus size={14} aria-hidden="true" />
            ADICIONAR ENDEREÇO
          </button>

          <button
            type="button"
            onClick={clearCustomer}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 border border-white/10 px-3 py-2 text-[0.7rem] font-semibold tracking-widest text-white/60 outline-none transition-colors hover:border-brand hover:text-brand focus-visible:border-brand focus-visible:text-brand"
          >
            <LogOut size={14} aria-hidden="true" />
            SAIR
          </button>
        </PopoverContent>
      </Popover>

      <AddAddressSheet
        customerId={customer.id}
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        onAdded={addAddress}
      />

      <EditAddressSheet
        customerId={customer.id}
        address={addressToEdit}
        open={Boolean(addressToEdit)}
        onOpenChange={(open) => !open && setAddressToEdit(null)}
        onUpdated={updateAddress}
      />
    </>
  );
}
