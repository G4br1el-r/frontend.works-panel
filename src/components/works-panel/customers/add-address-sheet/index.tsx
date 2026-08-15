"use client";

import { useFormState } from "react-hook-form";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { CustomerAddressFields } from "@/components/works-panel/customers/customer-address-fields";
import { useAddAddress } from "@/hooks/works-panel/customer/use-add-address";

const ADD_ADDRESS_FORM_ID = "add-customer-address-form";

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

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Novo endereço"
      description="Cadastre mais um endereço para esse cliente."
      saveLabel="Cadastrar endereço"
      formId={ADD_ADDRESS_FORM_ID}
      onClear={() => addressForm.form.reset()}
      disabled={isSubmitting}
    >
      <CustomerAddressFields {...addressForm} formId={ADD_ADDRESS_FORM_ID} />
    </FormSheet>
  );
}
