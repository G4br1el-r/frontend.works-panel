"use client";

import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import type { SelectComboboxOption } from "@/components/shared/select-combobox";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

export function useCustomerForm(customers: CustomerResponseType[]) {
  const customerId = useNewOrderStore((state) => state.customerId);
  const addressId = useNewOrderStore((state) => state.addressId);
  const setCustomerId = useNewOrderStore((state) => state.setCustomerId);
  const setAddressId = useNewOrderStore((state) => state.setAddressId);

  const customerOptions: SelectComboboxOption[] = customers.map((customer) => ({
    value: String(customer.id),
    label: customer.name,
  }));

  const selectedCustomer =
    customers.find((customer) => String(customer.id) === customerId) ?? null;

  const addressOptions: SelectComboboxOption[] =
    selectedCustomer?.addresses.map((address) => ({
      value: String(address.id),
      label: `${address.street}, ${address.number} — ${address.city}`,
    })) ?? [];

  function handleCustomerChange(value: string | null) {
    setCustomerId(value);
  }

  return {
    customerId,
    addressId,
    setAddressId,
    selectedCustomer,
    customerOptions,
    addressOptions,
    handleCustomerChange,
  };
}
