"use client";

import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { useBudgetFieldErrors } from "@/hooks/works-panel/order/use-budget-field-errors";
import { useCustomerForm } from "@/hooks/works-panel/order/use-customer-form";
import { WrapperForm } from "../wrapper-form";

interface CustomerFormProps {
  customers: CustomerResponseType[];
}

export function CustomerForm({ customers }: CustomerFormProps) {
  const {
    customerId,
    addressId,
    setAddressId,
    selectedCustomer,
    customerOptions,
    addressOptions,
    handleCustomerChange,
  } = useCustomerForm(customers);
  const fieldErrors = useBudgetFieldErrors();

  return (
    <WrapperForm
      title="Cliente"
      description="Selecione o cliente para este orçamento."
      icon="user"
    >
      <div className="w-full min-w-0 sm:w-64 sm:shrink-0">
        <SelectCombobox
          options={customerOptions}
          value={customerId}
          onChange={handleCustomerChange}
          placeholder="Buscar cliente"
          searchPlaceholder="Buscar por nome..."
          emptyMessage="Nenhum cliente encontrado."
          hasError={Boolean(fieldErrors.customerId)}
        />
      </div>
      <div className="w-full min-w-0 flex-1">
        <SelectCombobox
          options={addressOptions}
          value={addressId}
          onChange={setAddressId}
          placeholder={
            selectedCustomer
              ? "Selecionar endereço"
              : "Selecione um cliente primeiro"
          }
          searchPlaceholder="Buscar endereço..."
          emptyMessage="Nenhum endereço cadastrado."
          disabled={!selectedCustomer}
          hasError={Boolean(fieldErrors.addressId)}
        />
      </div>
    </WrapperForm>
  );
}
