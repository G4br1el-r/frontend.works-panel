"use client";

import { MapPin, Pencil, Plus, Route, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-hook-form";
import { toast } from "react-hot-toast";
import type {
  AddressResponseType,
  CustomerResponseType,
} from "@/@type/works-panel/customer/get-customer.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { FormSheet } from "@/components/shared/form-sheet";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { AddAddressSheet } from "@/components/works-panel/customers/add-address-sheet";
import { EditAddressSheet } from "@/components/works-panel/customers/edit-address-sheet";
import { EditCustomerForm } from "@/components/works-panel/customers/edit-customer-form";
import { useEditCustomer } from "@/hooks/works-panel/customer/use-edit-customer";

const ADDRESS_TYPE_LABEL: Record<AddressResponseType["type"], string> = {
  RESIDENTIAL: "RESIDENCIAL",
  COMMERCIAL: "COMERCIAL",
};

function formatDistance(distanceInMeters: number) {
  const km = (distanceInMeters / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const meters = Math.round(distanceInMeters).toLocaleString("pt-BR");

  return `${km} km (${meters} m)`;
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

interface EditCustomerDialogProps {
  customer: CustomerResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerUpdate: (customer: CustomerResponseType) => void;
}

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
  onCustomerUpdate,
}: EditCustomerDialogProps) {
  const { form, onInvalid, onSubmit } = useEditCustomer({
    customer,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] =
    useState<AddressResponseType | null>(null);
  const [addressToDelete, setAddressToDelete] =
    useState<AddressResponseType | null>(null);
  const [isDeletingAddress, setIsDeletingAddress] = useState(false);

  if (!customer) {
    return (
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar cliente"
        description="Atualize os dados do cliente."
        saveLabel="Salvar alterações"
        formId="edit-customer-form"
        disabled
      >
        <div />
      </FormSheet>
    );
  }

  const canDeleteAddress = customer.addresses.length > 1;

  async function handleConfirmDeleteAddress() {
    if (!customer || !addressToDelete) return;

    setIsDeletingAddress(true);

    try {
      await toast.promise(deleteAddress(customer.id, addressToDelete.id), {
        loading: "Excluindo endereço...",
        success: "Endereço excluído.",
        error: "Não foi possível excluir o endereço.",
      });

      onCustomerUpdate({
        ...customer,
        addresses: customer.addresses.filter(
          (address) => address.id !== addressToDelete.id,
        ),
      });
      setAddressToDelete(null);
    } finally {
      setIsDeletingAddress(false);
    }
  }

  return (
    <>
      <FormSheet
        open={open}
        onOpenChange={onOpenChange}
        title="Editar cliente"
        description="Atualize os dados do cliente."
        saveLabel="Salvar alterações"
        formId="edit-customer-form"
        onClear={() => form.reset()}
        disabled={isSubmitting}
      >
        <div className="flex flex-col gap-6">
          <EditCustomerForm
            form={form}
            onInvalid={onInvalid}
            onSubmit={onSubmit}
            formId="edit-customer-form"
          />

          <div className="flex flex-col gap-3 border-t border-panel-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-panel-surface-foreground">
                Endereços
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 cursor-pointer gap-1.5 hover:bg-panel-border"
                onClick={() => setIsAddAddressOpen(true)}
              >
                <Plus className="size-3.5" />
                Adicionar
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {customer.addresses.map((address) => (
                <div
                  key={address.id}
                  className="flex flex-col gap-2.5 rounded-lg border border-panel-border bg-panel-page/60 p-2.5"
                >
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="mt-0.5 shrink-0 text-panel-accent"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[0.65rem] font-semibold tracking-widest text-panel-accent">
                        {ADDRESS_TYPE_LABEL[address.type]}
                      </span>
                      <p className="mt-0.5 text-sm text-panel-surface-foreground">
                        {address.street}, {address.number}
                      </p>
                      <p className="text-xs text-panel-muted-foreground">
                        {address.neighborhood} — {address.city}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <TooltipComponent
                        content="Editar"
                        disableHoverableContent
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="cursor-pointer text-panel-muted-foreground hover:bg-sidebar-accent hover:text-panel-accent!"
                          onClick={() => setAddressToEdit(address)}
                        >
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Editar endereço</span>
                        </Button>
                      </TooltipComponent>
                      <TooltipComponent
                        content={
                          canDeleteAddress
                            ? "Excluir"
                            : "Cadastre outro endereço antes de excluir este"
                        }
                        disableHoverableContent
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          disabled={!canDeleteAddress}
                          className="cursor-pointer text-panel-muted-foreground hover:bg-sidebar-accent hover:text-destructive! disabled:cursor-not-allowed disabled:opacity-40"
                          onClick={() => setAddressToDelete(address)}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Excluir endereço</span>
                        </Button>
                      </TooltipComponent>
                    </div>
                  </div>

                  <div className="ml-5.5 flex w-fit items-center gap-1.5 rounded-full bg-panel-accent/10 px-2.5 py-1">
                    <Route
                      size={12}
                      className="shrink-0 text-panel-accent"
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-panel-accent">
                      {formatDistance(address.distanceInMeters)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormSheet>

      <AddAddressSheet
        customerId={customer.id}
        open={isAddAddressOpen}
        onOpenChange={setIsAddAddressOpen}
        onAdded={(address) =>
          onCustomerUpdate({
            ...customer,
            addresses: [...customer.addresses, address],
          })
        }
      />

      <EditAddressSheet
        customerId={customer.id}
        address={addressToEdit}
        open={Boolean(addressToEdit)}
        onOpenChange={(isOpen) => !isOpen && setAddressToEdit(null)}
        onUpdated={(updated) =>
          onCustomerUpdate({
            ...customer,
            addresses: customer.addresses.map((address) =>
              address.id === updated.id ? updated : address,
            ),
          })
        }
      />

      <ConfirmDialog
        open={addressToDelete !== null}
        onOpenChange={(isOpen) => !isOpen && setAddressToDelete(null)}
        title="Excluir endereço"
        description="Tem certeza que deseja excluir esse endereço? Essa ação não pode ser desfeita."
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={isDeletingAddress}
        onConfirm={handleConfirmDeleteAddress}
      />
    </>
  );
}
