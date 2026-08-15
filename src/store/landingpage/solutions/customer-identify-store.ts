import { create } from "zustand";
import type { CartServiceItem } from "@/store/landingpage/solutions/cart-store";

interface PendingCartItem {
  segmentId: number;
  segmentName: string;
  item: CartServiceItem;
}

interface OpenIdentifyOptions {
  pendingItem?: PendingCartItem;
  onIdentified?: () => void;
}

interface CustomerIdentifyState {
  isOpen: boolean;
  pendingItem: PendingCartItem | null;
  onIdentified: (() => void) | null;
  open: (options?: OpenIdentifyOptions) => void;
  close: () => void;
}

export const useCustomerIdentifyStore = create<CustomerIdentifyState>()(
  (set) => ({
    isOpen: false,
    pendingItem: null,
    onIdentified: null,
    open: (options) =>
      set({
        isOpen: true,
        pendingItem: options?.pendingItem ?? null,
        onIdentified: options?.onIdentified ?? null,
      }),
    close: () => set({ isOpen: false, pendingItem: null, onIdentified: null }),
  }),
);
