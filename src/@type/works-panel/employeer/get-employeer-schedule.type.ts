import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";

/**
 * Diferente do `GET /employeer`, que devolve `Decimal` como string, este
 * endpoint entrega os monetários já como number — não aplique `toNumber()`.
 */
export interface EmployeerScheduleDayType {
  date: string;
  /** `null` quando o orçamento não tem atendimento naquele dia da semana. */
  startTime: string | null;
  endTime: string | null;
}

export interface EmployeerScheduleWorkType {
  budgetId: number;
  customerId: number;
  customerName: string;
  /** Só `APPROVED` ou `CANCELED` — obra cancelada aparece marcada, não some. */
  budgetStatus: BudgetStatus;
  startDate: string;
  endDate: string;
  daysCount: number;
  /** A diária combinada nesta obra: pode diferir da cadastrada hoje. */
  dailyRate: number;
  total: number;
  days: EmployeerScheduleDayType[];
}

export interface EmployeerScheduleTotalsType {
  worksCount: number;
  daysCount: number;
  totalEarnings: number;
}

export interface EmployeerScheduleResponseType {
  employeer: {
    id: number;
    name: string;
    /** A diária cadastrada hoje, não a de cada obra. */
    dailyRate: number;
  };
  totals: EmployeerScheduleTotalsType;
  works: EmployeerScheduleWorkType[];
}
