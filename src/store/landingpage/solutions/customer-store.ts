import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AddressResponseType,
  CustomerResponseType,
} from "@/@type/works-panel/customer/get-customer.type";

interface CustomerState {
  customer: CustomerResponseType | null;
  setCustomer: (customer: CustomerResponseType) => void;
  addAddress: (address: AddressResponseType) => void;
  updateAddress: (address: AddressResponseType) => void;
  removeAddress: (addressId: number) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customer: null,
      setCustomer: (customer) => set({ customer }),
      addAddress: (address) =>
        set((state) =>
          state.customer
            ? {
                customer: {
                  ...state.customer,
                  addresses: [...state.customer.addresses, address],
                },
              }
            : state,
        ),
      updateAddress: (address) =>
        set((state) =>
          state.customer
            ? {
                customer: {
                  ...state.customer,
                  addresses: state.customer.addresses.map((item) =>
                    item.id === address.id ? address : item,
                  ),
                },
              }
            : state,
        ),
      removeAddress: (addressId) =>
        set((state) =>
          state.customer
            ? {
                customer: {
                  ...state.customer,
                  addresses: state.customer.addresses.filter(
                    (item) => item.id !== addressId,
                  ),
                },
              }
            : state,
        ),
      clearCustomer: () => set({ customer: null }),
    }),
    {
      name: "gui-goulart:customer",
    },
  ),
);
