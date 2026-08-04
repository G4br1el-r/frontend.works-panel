import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartBySolution = Record<string, string[]>;

interface CartState {
  cart: CartBySolution;
  addItem: (solutionLabel: string, servico: string) => void;
  removeItem: (solutionLabel: string, servico: string) => void;
  toggleItem: (solutionLabel: string, servico: string) => void;
  isInCart: (solutionLabel: string, servico: string) => boolean;
  clearSolution: (solutionLabel: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {},

      addItem: (solutionLabel, servico) => {
        set((state) => {
          const current = state.cart[solutionLabel] ?? [];
          if (current.includes(servico)) return state;
          return {
            cart: { ...state.cart, [solutionLabel]: [...current, servico] },
          };
        });
      },

      removeItem: (solutionLabel, servico) => {
        set((state) => {
          const current = state.cart[solutionLabel] ?? [];
          const next = current.filter((item) => item !== servico);
          const cart = { ...state.cart };
          if (next.length > 0) {
            cart[solutionLabel] = next;
          } else {
            delete cart[solutionLabel];
          }
          return { cart };
        });
      },

      toggleItem: (solutionLabel, servico) => {
        const current = get().cart[solutionLabel] ?? [];
        if (current.includes(servico)) {
          get().removeItem(solutionLabel, servico);
        } else {
          get().addItem(solutionLabel, servico);
        }
      },

      isInCart: (solutionLabel, servico) => {
        return (get().cart[solutionLabel] ?? []).includes(servico);
      },

      clearSolution: (solutionLabel) => {
        set((state) => {
          const cart = { ...state.cart };
          delete cart[solutionLabel];
          return { cart };
        });
      },

      clearCart: () => set({ cart: {} }),
    }),
    {
      name: "gui-goulart:cart",
    },
  ),
);

export function useCartItemCount() {
  return useCartStore((state) =>
    Object.values(state.cart).reduce(
      (total, servicos) => total + servicos.length,
      0,
    ),
  );
}
