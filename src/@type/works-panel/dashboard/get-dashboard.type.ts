import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";

/** Recorte de datas do dashboard. `null` = sem limite naquela ponta. */
export interface DashboardDateRange {
  from: string | null;
  to: string | null;
}

export interface DashboardFilters {
  range: DashboardDateRange;
  /** Vazio = todos os clientes. Aceita múltiplos. */
  customerIds: number[];
}

/** Bloco fixo: saúde geral do negócio, nunca reage aos filtros. */
export interface DashboardOverviewType {
  activeBudgets: number;
  customersCount: number;
  openReceivable: number;
  overdueTotal: number;
  scheduledDays: number;
}

export interface DashboardKpisType {
  quotedTotal: number;
  quotedCount: number;
  approvedTotal: number;
  approvedCount: number;
  conversionRate: number;
  receivedTotal: number;
  receivedCount: number;
  receivableTotal: number;
  receivableCount: number;
  overdueTotal: number;
  overdueCount: number;
}

/** O backend manda o enum cru — a tradução é do front. */
export interface StatusSliceType {
  status: BudgetStatus;
  count: number;
  total: number;
}

export interface RankedValueType {
  id: number;
  label: string;
  value: number;
  /** Quantidade de ocorrências — serviços vendidos, obras do cliente, etc. */
  count: number;
}

/** Ponto da série mensal. `monthKey` é "YYYY-MM"; o rótulo é formatado no front. */
export interface RevenuePointType {
  monthKey: string;
  received: number;
  receivable: number;
  overdue: number;
}

export interface ScheduleOccupationType {
  busyDays: number;
  totalDays: number;
  freeDays: number;
  rate: number;
}

export interface UpcomingInstallmentType {
  id: number;
  budgetId: number;
  customerName: string;
  dueDate: string;
  /** Já vem como number — diferente do `amount` do /installment, que é string. */
  amount: number;
  isOverdue: boolean;
}

export interface UpcomingWorkType {
  budgetId: number;
  customerName: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  teamSize: number;
}

/** Resposta completa do `GET /dashboard`. */
export interface DashboardDataType {
  /** Ignora os filtros de propósito: é a referência fixa do negócio. */
  overview: DashboardOverviewType;
  kpis: DashboardKpisType;
  statusBreakdown: StatusSliceType[];
  revenueSeries: RevenuePointType[];
  topServices: RankedValueType[];
  topSegments: RankedValueType[];
  topCustomers: RankedValueType[];
  occupation: ScheduleOccupationType;
  upcomingInstallments: UpcomingInstallmentType[];
  upcomingWorks: UpcomingWorkType[];
}

export interface DashboardCustomerOptionType {
  id: number;
  name: string;
}
