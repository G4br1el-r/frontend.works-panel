import { create } from "zustand";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";

interface AddressSelectState {
  isOpen: boolean;
  onSelected: ((address: AddressResponseType) => void) | null;
  open: (onSelected: (address: AddressResponseType) => void) => void;
  close: () => void;
}

export const useAddressSelectStore = create<AddressSelectState>()((set) => ({
  isOpen: false,
  onSelected: null,
  open: (onSelected) => set({ isOpen: true, onSelected }),
  close: () => set({ isOpen: false, onSelected: null }),
}));
