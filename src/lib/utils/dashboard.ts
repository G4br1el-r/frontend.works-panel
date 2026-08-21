import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type {
  RevenuePointType,
  StatusSliceType,
} from "@/@type/works-panel/dashboard/get-dashboard.type";
import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";
import { BUDGET_STATUS_LABEL } from "@/lib/order/format-budget";

/**
 * Colunas DATE do Postgres chegam como "YYYY-MM-DDT00:00:00.000Z". Formatar no
 * fuso local jogaria o dia 01 para o 30 anterior no Brasil (UTC-3), então
 * lemos a data em UTC.
 */
export function formatApiDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/** "YYYY-MM" → "ago/26", para o eixo da série mensal. */
export function formatMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return format(new Date(year, month - 1, 1), "MMM/yy", { locale: ptBR });
}

/** `YYYY-MM-DD` a partir de um Date local, sem o deslocamento do toISOString. */
export function toApiDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

/** Ordem fixa do funil, para o gráfico não dançar entre um load e outro. */
const STATUS_ORDER: BudgetStatus[] = [
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
  "CANCELED",
];

export interface StatusSliceViewType extends StatusSliceType {
  label: string;
}

/**
 * O backend só devolve status com ao menos um orçamento. Ordenamos pelo funil
 * e traduzimos aqui — sem completar com zerados, que só poluiriam a legenda.
 */
export function toStatusSlices(
  breakdown: StatusSliceType[],
): StatusSliceViewType[] {
  return [...breakdown]
    .sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
    )
    .map((slice) => ({ ...slice, label: BUDGET_STATUS_LABEL[slice.status] }));
}

export interface RevenuePointViewType extends RevenuePointType {
  label: string;
}

export function toRevenueSeries(
  series: RevenuePointType[],
): RevenuePointViewType[] {
  return series.map((point) => ({
    ...point,
    label: formatMonthKey(point.monthKey),
  }));
}
