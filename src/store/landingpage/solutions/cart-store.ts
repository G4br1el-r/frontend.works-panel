import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartServiceItem {
  id: number;
  name: string;
  basePrice: string;
}

interface CartGroup {
  segmentName: string;
  items: CartServiceItem[];
}

export type CartBySegment = Record<number, CartGroup>;

interface CartState {
  cart: CartBySegment;
  addItem: (segmentId: number, segmentName: string, item: CartServiceItem) => void;
  removeItem: (segmentId: number, itemId: number) => void;
  toggleItem: (segmentId: number, segmentName: string, item: CartServiceItem) => void;
  isInCart: (segmentId: number, itemId: number) => boolean;
  clearSolution: (segmentId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},

      addItem: (segmentId, segmentName, item) => {
        set((state) => {
          const current = state.cart[segmentId]?.items ?? [];
          if (current.some((existing) => existing.id === item.id)) return state;
          return {
            cart: {
              ...state.cart,
              [segmentId]: { segmentName, items: [...current, item] },
            },
          };
        });
      },

      removeItem: (segmentId, itemId) => {
        set((state) => {
          const group = state.cart[segmentId];
          if (!group) return state;

          const items = group.items.filter((item) => item.id !== itemId);
          const cart = { ...state.cart };
          if (items.length > 0) {
            cart[segmentId] = { ...group, items };
          } else {
            delete cart[segmentId];
          }
          return { cart };
        });
      },

      toggleItem: (segmentId, segmentName, item) => {
        if (get().isInCart(segmentId, item.id)) {
          get().removeItem(segmentId, item.id);
        } else {
          get().addItem(segmentId, segmentName, item);
        }
      },

      isInCart: (segmentId, itemId) => {
        return (get().cart[segmentId]?.items ?? []).some((item) => item.id === itemId);
      },

      clearSolution: (segmentId) => {
        set((state) => {
          const cart = { ...state.cart };
          delete cart[segmentId];
          return { cart };
        });
      },

      clearCart: () => set({ cart: {} }),
    }),
    {
      name: "gui-goulart:cart",
      version: 1,
      migrate: () => ({ cart: {} }),
    },
  ),
);

export function useCartItemCount() {
  return useCartStore((state) =>
    Object.values(state.cart).reduce((total, group) => total + group.items.length, 0),
  );
}
