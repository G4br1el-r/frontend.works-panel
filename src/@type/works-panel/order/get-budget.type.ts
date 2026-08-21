import type {
  AddressResponseType,
  CustomerResponseType,
} from "@/@type/works-panel/customer/get-customer.type";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";

export type BudgetStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";
export type BudgetPaymentType = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "SINGLE";
export type BudgetWeekDay =
  | "SUN"
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT";

/**
 * Campos `Decimal` do banco chegam como string no JSON (ex: "40924.4").
 * Converta com `Number()` antes de calcular ou formatar.
 */
export interface BudgetAttendanceDayResponseType {
  id: number;
  budgetId: number;
  weekDay: BudgetWeekDay;
  startTime: string;
  endTime: string;
}

export interface BudgetServiceResponseType {
  id: number;
  budgetId: number;
  serviceItemId: number;
  quantity: string;
  unitPrice: string;
  /** Sem a relação `materials` — o GET /budget não a inclui. */
  serviceItem: Omit<ServiceItemResponseType, "materials"> &
    Partial<Pick<ServiceItemResponseType, "materials">>;
}

export interface BudgetMaterialFromServiceItemResponseType {
  budgetMaterialId: number;
  budgetServiceId: number;
  serviceItemId: number;
}

export interface BudgetMaterialResponseType {
  id: number;
  budgetId: number;
  materialId: number;
  quantity: string;
  unitPrice: string;
  material: MaterialResponseType;
  fromServiceItems: BudgetMaterialFromServiceItemResponseType[];
}

/** Uma linha por funcionário + data (não vem agrupado). */
export interface BudgetAllocationResponseType {
  id: number;
  budgetId: number;
  employeerId: number;
  dailyRate: string;
  date: string;
  employeer: EmployeerResponseType;
}

export interface BudgetInstallmentResponseType {
  id: number;
  budgetId: number;
  number: number;
  dueDate: string;
  amount: string;
  isManuallyEdited: boolean;
  paidAt: string | null;
  /** Preenchido quando o orçamento foi cancelado com a parcela em aberto. */
  canceledAt: string | null;
}

/** Comprovante arquivado de um envio ao cliente. */
export interface BudgetSentPdfResponseType {
  id: number;
  version: number;
  fileName: string;
  byteSize: number;
  /** Valor da época do envio, não o atual do orçamento. Vem como string. */
  clientTotal: string;
  sentAt: string;
}

export interface BudgetSendResponseType {
  budget: BudgetResponseType;
  sentPdf: Omit<BudgetSentPdfResponseType, "clientTotal">;
}

export interface BudgetResponseType {
  id: number;
  status: BudgetStatus;
  customerId: number;
  addressId: number;
  sourceOrderId: number | null;
  startDate: string;
  endDate: string;
  absorbCost: boolean;
  profitMargin: string;
  clientTotal: string;
  paymentType: BudgetPaymentType;
  firstInstallmentDate: string;
  observation: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerResponseType;
  address: AddressResponseType;
  attendanceDays: BudgetAttendanceDayResponseType[];
  services: BudgetServiceResponseType[];
  materials: BudgetMaterialResponseType[];
  allocations: BudgetAllocationResponseType[];
  installments: BudgetInstallmentResponseType[];
}
