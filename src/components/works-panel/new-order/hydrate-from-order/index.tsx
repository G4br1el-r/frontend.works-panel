"use client";

import { useRef } from "react";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

interface HydrateFromOrderProps {
  order: OrderResponseType;
  catalog: ServiceItemResponseType[];
}

/**
 * Preenche o formulário com o que o cliente já escolheu no site. Roda uma vez
 * por pedido — reexecutar sobrescreveria o que o usuário editou desde então.
 *
 * Executa durante o render (logo após o reset, que também é síncrono) para que
 * os dados não sejam apagados por um efeito que rodaria depois.
 */
export function HydrateFromOrder({ order, catalog }: HydrateFromOrderProps) {
  const hydratedOrderId = useRef<number | null>(null);

  if (hydratedOrderId.current !== order.id) {
    hydratedOrderId.current = order.id;
    useNewOrderStore.getState().hydrateFromOrder(order, catalog);
  }

  return null;
}
