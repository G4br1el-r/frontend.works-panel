/**
 * Campos `Decimal` do banco chegam como string no JSON (ex: "22288.48").
 * Converta com `Number()` antes de calcular ou formatar.
 */
export interface InstallmentResponseType {
  id: number;
  number: number;
  /** Total de parcelas do orçamento — usado para renderizar "parcela 2/4". */
  totalInstallments: number;
  dueDate: string;
  amount: string;
  /** `null` quando a parcela ainda não foi baixada. */
  paidAt: string | null;
  /** Preenchido quando o orçamento foi cancelado com a parcela em aberto. */
  canceledAt: string | null;
  budget: {
    id: number;
  };
  customer: {
    id: number;
    name: string;
    document: string;
  };
}

/**
 * Resposta de `pay`/`unpay`: a row crua da parcela. Shape diferente do GET —
 * traz `budgetId` e `isManuallyEdited`, e não traz `totalInstallments`,
 * `budget` nem `customer`.
 */
export interface InstallmentMutationResponseType {
  id: number;
  budgetId: number;
  number: number;
  dueDate: string;
  amount: string;
  isManuallyEdited: boolean;
  paidAt: string | null;
  canceledAt: string | null;
}

export type InstallmentSituation = "PAID" | "CANCELED" | "OVERDUE" | "PENDING";

/**
 * Parcela já normalizada no servidor: valor numérico e situação derivada.
 * É o formato que chega no client — ele não recalcula nada disso.
 */
export interface InstallmentRowType {
  id: number;
  budgetId: number;
  number: number;
  totalInstallments: number;
  dueDate: string;
  amount: number;
  paidAt: string | null;
  canceledAt: string | null;
  customerId: number;
  customerName: string;
  /** Só dígitos, como vem do banco. Formatado na exibição. */
  customerDocument: string;
  situation: InstallmentSituation;
  /**
   * Orçamento cancelado. Diferente de `canceledAt`, que só é preenchido nas
   * parcelas em aberto — uma parcela paga antes do cancelamento fica com
   * `canceledAt` nulo mas ainda pertence a um orçamento cancelado.
   */
  isBudgetCanceled: boolean;
}

/** Serviço/material do orçamento, já achatado para exibição no sheet. */
export interface BudgetDetailLineType {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  measureName: string | null;
}

/**
 * Detalhes de um orçamento exibidos no sheet. Montado no servidor a partir do
 * `GET /budget`, que já traz cliente, serviços e materiais aninhados.
 */
/** Dia de atendimento com o horário de trabalho já formatado. */
export interface BudgetAttendanceDayDetailType {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
}

/** Funcionário com as diárias já agrupadas (a API manda uma linha por data). */
export interface BudgetEmployeerDetailType {
  id: number;
  name: string;
  dailyRate: number;
  daysCount: number;
  total: number;
}

export interface BudgetDetailType {
  id: number;
  /** Orçamento cancelado: o sheet avisa logo no topo. */
  isCanceled: boolean;
  customerName: string;
  customerDocument: string;
  customerEmail: string | null;
  customerPhone: string | null;
  addressLabel: string | null;
  startDate: string;
  endDate: string;
  clientTotal: number;
  observation: string | null;
  paymentTypeLabel: string;
  firstInstallmentDate: string;
  installmentsCount: number;
  attendanceDays: BudgetAttendanceDayDetailType[];
  employeers: BudgetEmployeerDetailType[];
  services: BudgetDetailLineType[];
  materials: BudgetDetailLineType[];
  sentPdfs: BudgetSentPdfSummaryType[];
}

/** Envio arquivado do orçamento, para a lista de PDFs do sheet. */
export interface BudgetSentPdfSummaryType {
  id: number;
  version: number;
  fileName: string;
  sentAt: string;
  clientTotal: number;
}

export interface InstallmentSummaryType {
  weekToReceive: { total: number; count: number };
  weekReceived: { total: number; count: number };
  monthToReceive: { total: number; count: number };
  overdue: { total: number; count: number };
}
