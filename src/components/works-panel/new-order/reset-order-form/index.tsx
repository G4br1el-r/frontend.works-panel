"use client";

import { useRef } from "react";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

interface ResetOrderFormProps {
  /** Identifica o orçamento aberto: novo, vindo de pedido, edição ou cópia. */
  formKey: string;
}

/**
 * Zera o formulário ao abrir um orçamento diferente do anterior. A store é um
 * singleton de módulo e sobrevive à navegação — sem isso, um orçamento novo
 * herdaria os dados do último que esteve na tela.
 *
 * Limpa durante o render, antes das hidratações (que rodam em efeito), para não
 * apagar os dados que elas carregam em seguida.
 */
export function ResetOrderForm({ formKey }: ResetOrderFormProps) {
  const lastFormKey = useRef<string | null>(null);
  const isFirstMount = useRef(true);

  // Na primeira montagem sempre limpa: a store pode trazer sobras da tela
  // anterior. Depois disso, só quando muda o orçamento aberto.
  if (isFirstMount.current || lastFormKey.current !== formKey) {
    isFirstMount.current = false;
    lastFormKey.current = formKey;
    useNewOrderStore.getState().resetForm();
  }

  return null;
}
