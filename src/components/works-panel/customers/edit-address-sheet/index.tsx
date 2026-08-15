"use client";

import { useFormState } from "react-hook-form";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { CustomerAddressFields } from "@/components/works-panel/customers/customer-address-fields";
import { useEditAddress } from "@/hooks/works-panel/customer/use-edit-address";

const EDIT_ADDRESS_FORM_ID = "edit-customer-address-form";

interface EditAddressSheetProps {
  customerId: number;
  address: AddressResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (address: AddressResponseType) => void;
}

export function EditAddressSheet({
  customerId,
  address,
  open,
  onOpenChange,
  onUpdated,
}: EditAddressSheetProps) {
  const addressForm = useEditAddress({
    customerId,
    address,
    onUpdated: (updated) => {
      onOpenChange(false);
      onUpdated(updated);
    },
  });
  const { isSubmitting } = useFormState({ control: addressForm.form.control });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar endereço"
      description="Atualize os dados desse endereço."
      saveLabel="Salvar alterações"
      formId={EDIT_ADDRESS_FORM_ID}
      onClear={() => addressForm.form.reset()}
      disabled={isSubmitting}
    >
      <CustomerAddressFields {...addressForm} formId={EDIT_ADDRESS_FORM_ID} />
    </FormSheet>
  );
}
