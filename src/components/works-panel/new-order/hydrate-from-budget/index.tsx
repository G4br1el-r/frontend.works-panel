"use client";

import { useRef } from "react";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

interface HydrateFromBudgetProps {
  budget: BudgetResponseType;
  /** Serviços com `materials` — o GET /budget não traz essa relação. */
  catalog: ServiceItemResponseType[];
  /** true = editar (salva por PUT no mesmo id) · false = duplicar (cria novo) */
  keepId: boolean;
}

/**
 * Carrega um orçamento existente no formulário. Roda uma vez por orçamento —
 * reexecutar sobrescreveria o que o usuário já editou.
 *
 * Executa durante o render (logo após o reset, que também é síncrono) para que
 * os dados não sejam apagados por um efeito que rodaria depois.
 */
export function HydrateFromBudget({
  budget,
  catalog,
  keepId,
}: HydrateFromBudgetProps) {
  const hydratedKey = useRef<string | null>(null);
  const key = `${budget.id}-${keepId}`;

  if (hydratedKey.current !== key) {
    hydratedKey.current = key;
    useNewOrderStore.getState().hydrateFromBudget(budget, catalog, { keepId });
  }

  return null;
}
