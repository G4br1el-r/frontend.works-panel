import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ContactInfo {
  name: string;
  cep: string;
  phone: string;
}

interface ContactState {
  contact: ContactInfo | null;
  setContact: (contact: ContactInfo) => void;
  clearContact: () => void;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contact: null,
      setContact: (contact) => set({ contact }),
      clearContact: () => set({ contact: null }),
    }),
    {
      name: "gui-goulart:contact",
    },
  ),
);
