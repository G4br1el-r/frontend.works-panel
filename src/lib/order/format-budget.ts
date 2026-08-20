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
};

export const BUDGET_STATUS_CLASSNAME: Record<BudgetStatus, string> = {
  DRAFT: "border-panel-border bg-panel-page text-panel-muted-foreground",
  SENT: "border-status-warning/30 bg-status-warning-bg text-status-warning",
  APPROVED: "border-status-success/30 bg-status-success-bg text-status-success",
  REJECTED: "border-status-danger/30 bg-status-danger-bg text-status-danger",
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

/** Orçamento fechado é imutável — o PUT devolve 409. */
export function isBudgetEditable(status: BudgetStatus): boolean {
  return status === "DRAFT" || status === "SENT";
}
