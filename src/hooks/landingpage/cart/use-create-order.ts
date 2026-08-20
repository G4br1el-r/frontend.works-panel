"use client";

import { toast } from "react-hot-toast";
import type { CreateOrderPayload } from "@/schema/landingpage/cart/create-order-payload-schema";

async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch("/api/landingpage/order/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar solicitação de orçamento");
  }

  return response.json();
}

interface UseCreateOrderOptions {
  onSuccess?: () => void;
}

export function useCreateOrder({ onSuccess }: UseCreateOrderOptions = {}) {
  async function submitOrder(payload: CreateOrderPayload) {
    try {
      await toast.promise(createOrder(payload), {
        loading: "Enviando solicitação...",
        success: "Solicitação enviada com sucesso!",
        error: "Não foi possível enviar sua solicitação.",
      });
      onSuccess?.();
    } catch {}
  }

  return { submitOrder };
}
