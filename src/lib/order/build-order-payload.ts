import { unmaskCurrency } from "@/lib/utils";
import type { PaymentType } from "@/lib/utils/generate-installments";
import type {
  AttendanceDays,
  EmployeerFormRow,
  InstallmentRow,
  MaterialFormRow,
  PricingSummary,
  ServiceFormRow,
  WeekDay,
} from "@/store/works-panel/order/new-order-store";
import { WEEK_DAYS } from "@/store/works-panel/order/new-order-store";

export interface OrderPayloadService {
  serviceItemId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderPayloadMaterial {
  materialId: number;
  quantity: number;
  unitPrice: number;
  /** Ids dos serviços que geraram este material automaticamente. Vazio = manual. */
  fromServiceItemIds: number[];
}

export interface OrderPayloadEmployeer {
  employeerId: number;
  dailyRate: number;
  /** Datas em ISO (yyyy-mm-dd) em que o funcionário trabalha. */
  dates: string[];
}

export interface OrderPayloadAttendanceDay {
  weekDay: WeekDay;
  startTime: string;
  endTime: string;
}

export interface OrderPayloadInstallment {
  number: number;
  dueDate: string;
  amount: number;
  isManuallyEdited: boolean;
}

export interface OrderPayload {
  customerId: number | null;
  addressId: number | null;
  schedule: {
    startDate: string;
    endDate: string;
    attendanceDays: OrderPayloadAttendanceDay[];
  };
  services: OrderPayloadService[];
  materials: OrderPayloadMaterial[];
  employeers: OrderPayloadEmployeer[];
  pricing: {
    absorbCost: boolean;
    profitMargin: number;
    clientTotal: number;
  };
  payment: {
    paymentType: PaymentType;
    firstInstallmentDate: string;
    installments: OrderPayloadInstallment[];
  };
  observation: string;
}

interface BuildOrderPayloadInput {
  customerId: string | null;
  addressId: string | null;
  sourceOrderId: number | null;
  startDate: string;
  endDate: string;
  attendanceDays: AttendanceDays;
  serviceRows: ServiceFormRow[];
  materialRows: MaterialFormRow[];
  employeerRows: EmployeerFormRow[];
  pricing: PricingSummary;
  paymentType: PaymentType;
  firstInstallmentDate: string;
  installments: InstallmentRow[];
  observation: string;
}

function toNumericId(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Converte o estado do formulário no payload que a API recebe: só ids e os
 * valores que o usuário definiu. Nada de objetos completos de serviço,
 * material ou funcionário — o backend já conhece esses cadastros.
 */
export function buildOrderPayload({
  customerId,
  addressId,
  sourceOrderId,
  startDate,
  endDate,
  attendanceDays,
  serviceRows,
  materialRows,
  employeerRows,
  pricing,
  paymentType,
  firstInstallmentDate,
  installments,
  observation,
}: BuildOrderPayloadInput): OrderPayload {
  const serviceItemIdByRowId = new Map(
    serviceRows.map((row) => [row.id, row.serviceItem.id]),
  );

  return {
    customerId: toNumericId(customerId),
    addressId: toNumericId(addressId),
    // Omitido quando não veio de pedido: mandar null removeria o vínculo.
    ...(sourceOrderId !== null ? { sourceOrderId } : {}),

    schedule: {
      startDate,
      endDate,
      attendanceDays: WEEK_DAYS.filter(
        (day) => attendanceDays[day].selected,
      ).map((day) => ({
        weekDay: day,
        startTime: attendanceDays[day].startTime,
        endTime: attendanceDays[day].endTime,
      })),
    },

    services: serviceRows.map((row) => ({
      serviceItemId: row.serviceItem.id,
      quantity: Number(row.quantity || 0),
      unitPrice: unmaskCurrency(row.unitPrice),
    })),

    materials: materialRows.map((row) => ({
      materialId: row.material.id,
      quantity: Number(row.quantity || 0),
      unitPrice: unmaskCurrency(row.unitPrice),
      fromServiceItemIds: row.sourceServiceRowIds
        .map((rowId) => serviceItemIdByRowId.get(rowId))
        .filter((id): id is number => id !== undefined),
    })),

    employeers: employeerRows.map((row) => ({
      employeerId: row.employeer.id,
      dailyRate: unmaskCurrency(row.dailyRate),
      dates: row.selectedDates,
    })),

    pricing: {
      absorbCost: pricing.absorbCost,
      profitMargin: pricing.profitMargin,
      clientTotal: pricing.clientTotal,
    },

    payment: {
      paymentType,
      firstInstallmentDate,
      installments: installments.map((row) => ({
        number: row.number,
        dueDate: toIsoDate(row.dueDate),
        amount: row.amount,
        isManuallyEdited: row.isManuallyEdited,
      })),
    },

    observation,
  };
}
