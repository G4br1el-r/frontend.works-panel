"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";
import { CreateCustomerForm } from "@/components/works-panel/customers/create-customer-form";
import { useCreateNewCustomer } from "@/hooks/works-panel/customer/use-create-new-customer";

export function CreateCustomerDialog() {
  const { form, onInvalid, onSubmit, handleCepComplete } =
    useCreateNewCustomer();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Novo cliente
        </Button>
      }
      title="Novo cliente"
      description="Cadastre um novo cliente e o endereço da obra."
      saveLabel="Cadastrar Cliente"
      formId="create-customer-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateCustomerForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        handleCepComplete={handleCepComplete}
        formId="create-customer-form"
      />
    </FormSheet>
  );
}
