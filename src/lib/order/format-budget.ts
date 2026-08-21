import type {
  BudgetPaymentType,
  BudgetStatus,
} from "@/@type/works-panel/order/get-budget.type";
import type { OrderStatus } from "@/@type/works-panel/order/get-order.type";

/**
 * As datas do backend vêm em ISO à meia-noite UTC. Formatar com os getters
 * locais jogaria o dia para trás no fuso do Brasil, então lemos em UTC.
 */
export function formatBudgetDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getUTCFullYear()}`;
}

/** Formata o período da obra de forma compacta: "01/09 – 31/10/2026". */
export function formatBudgetPeriod(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";

  const startLabel =
    start.getUTCFullYear() === end.getUTCFullYear()
      ? `${String(start.getUTCDate()).padStart(2, "0")}/${String(start.getUTCMonth() + 1).padStart(2, "0")}`
      : formatBudgetDate(startDate);

  return `${startLabel} – ${formatBudgetDate(endDate)}`;
}

export const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  DRAFT: "Rascunho",
  SENT: "Enviado",
  APPROVED: "Aprovado",
  REJECTED: "Recusado",
  CANCELED: "Cancelado",
};

export const BUDGET_STATUS_CLASSNAME: Record<BudgetStatus, string> = {
  DRAFT: "border-panel-border bg-panel-page text-panel-muted-foreground",
  SENT: "border-status-warning/30 bg-status-warning-bg text-status-warning",
  APPROVED: "border-status-success/30 bg-status-success-bg text-status-success",
  REJECTED: "border-status-danger/30 bg-status-danger-bg text-status-danger",
  CANCELED: "border-status-danger/30 bg-status-danger-bg text-status-danger",
};

export const PAYMENT_TYPE_LABEL: Record<BudgetPaymentType, string> = {
  SINGLE: "Único",
  WEEKLY: "Semanal",
  BIWEEKLY: "Quinzenal",
  MONTHLY: "Mensal",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  ACCEPTED: "Aceito",
  CANCELED: "Cancelado",
};

export const ORDER_STATUS_CLASSNAME: Record<OrderStatus, string> = {
  PENDING: "border-status-warning/30 bg-status-warning-bg text-status-warning",
  ACCEPTED: "border-status-success/30 bg-status-success-bg text-status-success",
  CANCELED: "border-status-danger/30 bg-status-danger-bg text-status-danger",
};

/** Resolve o rótulo da situação sem o chamador precisar saber a origem. */
export function getStatusLabel(status: BudgetStatus | OrderStatus): string {
  return (
    BUDGET_STATUS_LABEL[status as BudgetStatus] ??
    ORDER_STATUS_LABEL[status as OrderStatus] ??
    status
  );
}

export function getStatusClassName(status: BudgetStatus | OrderStatus): string {
  return (
    BUDGET_STATUS_CLASSNAME[status as BudgetStatus] ??
    ORDER_STATUS_CLASSNAME[status as OrderStatus] ??
    "border-panel-border bg-panel-page text-panel-muted-foreground"
  );
}

/**
 * Situações unificadas do painel e do site. O usuário não distingue "pedido
 * cancelado" de "orçamento cancelado" — é tudo cancelado. Cada chave lista os
 * status crus que ela cobre nas duas origens.
 */
export const UNIFIED_STATUS_FILTERS = [
  { value: "DRAFT", label: "Rascunho", matches: ["DRAFT"] },
  { value: "PENDING", label: "Pendente", matches: ["PENDING"] },
  { value: "SENT", label: "Enviado", matches: ["SENT"] },
  { value: "APPROVED", label: "Aprovado", matches: ["APPROVED", "ACCEPTED"] },
  { value: "REJECTED", label: "Recusado", matches: ["REJECTED"] },
  { value: "CANCELED", label: "Cancelado", matches: ["CANCELED"] },
] as const satisfies ReadonlyArray<{
  value: string;
  label: string;
  matches: readonly (BudgetStatus | OrderStatus)[];
}>;

/** Os status crus que cada filtro unificado seleciona. */
export function resolveUnifiedStatus(
  selected: string[],
): (BudgetStatus | OrderStatus)[] {
  return UNIFIED_STATUS_FILTERS.filter((filter) =>
    selected.includes(filter.value),
  ).flatMap((filter) => [...filter.matches]);
}

/** Orçamento fechado é imutável — o PUT devolve 409. */
export function isBudgetEditable(status: BudgetStatus): boolean {
  return status === "DRAFT" || status === "SENT";
}

/**
 * Transições permitidas pelo `PATCH /budget/:id`. Espelha a validação do
 * backend, que responde 409 no que não estiver aqui.
 *
 * `APPROVED → CANCELED` não aparece: o cancelamento tem rota própria
 * (`/cancel`), porque cancela as parcelas em aberto na mesma transação.
 */
export const BUDGET_STATUS_TRANSITIONS: Record<BudgetStatus, BudgetStatus[]> = {
  DRAFT: ["SENT", "REJECTED"],
  SENT: ["APPROVED", "REJECTED"],
  APPROVED: [],
  REJECTED: [],
  CANCELED: [],
};

export function canTransitionBudgetStatus(
  from: BudgetStatus,
  to: BudgetStatus,
): boolean {
  return from === to || BUDGET_STATUS_TRANSITIONS[from].includes(to);
}

/** Estado final: nenhuma troca de situação é mais possível. */
export function isBudgetStatusFinal(status: BudgetStatus): boolean {
  return BUDGET_STATUS_TRANSITIONS[status].length === 0;
}

/** Só orçamento aprovado pode ser cancelado. */
export function isBudgetCancelable(status: BudgetStatus): boolean {
  return status === "APPROVED";
}
