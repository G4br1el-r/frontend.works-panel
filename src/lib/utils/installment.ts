import {
  endOfMonth,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type {
  BudgetAttendanceDayDetailType,
  BudgetDetailLineType,
  BudgetDetailType,
  BudgetEmployeerDetailType,
  InstallmentResponseType,
  InstallmentRowType,
  InstallmentSituation,
  InstallmentSummaryType,
} from "@/@type/works-panel/installment/get-installment.type";
import type {
  BudgetResponseType,
  BudgetSentPdfResponseType,
  BudgetWeekDay,
} from "@/@type/works-panel/order/get-budget.type";
import { PAYMENT_TYPE_LABEL } from "@/lib/order/format-budget";

const WEEK_DAY_LABEL: Record<BudgetWeekDay, string> = {
  SUN: "Domingo",
  MON: "Segunda",
  TUE: "Terça",
  WED: "Quarta",
  THU: "Quinta",
  FRI: "Sexta",
  SAT: "Sábado",
};

/** Ordem de exibição dos dias, começando na segunda como no restante do painel. */
const WEEK_DAY_ORDER: BudgetWeekDay[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

/** Semana corrente de segunda a domingo, como definido pelo negócio. */
const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

/**
 * `dueDate` e `paidAt` são DATE no banco e chegam sempre como
 * "YYYY-MM-DDT00:00:00.000Z". Interpretar com `new Date()` e formatar no fuso
 * local jogaria o dia 01 para o dia 30 do mês anterior no Brasil (UTC-3), então
 * montamos a data no fuso local a partir do Y-M-D da própria string.
 */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDueDate(value: string): string {
  return parseDateOnly(value).toLocaleDateString("pt-BR");
}

/**
 * Precedência: pago vence cancelado. Uma parcela paga antes do orçamento ser
 * cancelado continua sendo dinheiro que entrou — não vira cancelada.
 */
function getSituation(
  paidAt: string | null,
  canceledAt: string | null,
  dueDate: string,
  today: Date,
): InstallmentSituation {
  if (paidAt) return "PAID";
  if (canceledAt) return "CANCELED";
  return parseDateOnly(dueDate) < today ? "OVERDUE" : "PENDING";
}

/**
 * Normaliza a resposta da API: converte `Decimal` string para número, achata o
 * cliente e deriva a situação. Roda no servidor — o client não recalcula nada.
 */
export function toInstallmentRows(
  installments: InstallmentResponseType[],
  /** Documento por cliente, vindo do `GET /budget` — o GET /installment não o traz. */
  documentByCustomerId: Map<number, string>,
  /** Ids de orçamentos cancelados, para marcar também as parcelas já pagas. */
  canceledBudgetIds: Set<number> = new Set(),
  reference: Date = new Date(),
): InstallmentRowType[] {
  const today = startOfDay(reference);

  return installments
    .map((installment) => ({
      id: installment.id,
      budgetId: installment.budget.id,
      number: installment.number,
      totalInstallments: installment.totalInstallments,
      dueDate: installment.dueDate,
      amount: Number(installment.amount),
      paidAt: installment.paidAt,
      canceledAt: installment.canceledAt,
      customerId: installment.customer.id,
      customerName: installment.customer.name,
      customerDocument:
        installment.customer.document ??
        documentByCustomerId.get(installment.customer.id) ??
        "",
      isBudgetCanceled: canceledBudgetIds.has(installment.budget.id),
      situation: getSituation(
        installment.paidAt,
        installment.canceledAt,
        installment.dueDate,
        today,
      ),
    }))
    .sort(
      // O backend já entrega ordenado por vencimento; reforçamos aqui para a
      // ordenação padrão da tela não depender disso.
      (a, b) =>
        parseDateOnly(a.dueDate).getTime() - parseDateOnly(b.dueDate).getTime(),
    );
}

/**
 * KPIs do topo da tela. Refletem o total geral e não reagem aos filtros da
 * tabela, por isso são calculados a partir da lista completa.
 */
export function buildInstallmentSummary(
  rows: InstallmentRowType[],
  reference: Date = new Date(),
): InstallmentSummaryType {
  const today = startOfDay(reference);
  const week = {
    start: startOfWeek(today, WEEK_OPTIONS),
    end: endOfWeek(today, WEEK_OPTIONS),
  };
  const month = { start: startOfMonth(today), end: endOfMonth(today) };

  const summary: InstallmentSummaryType = {
    weekToReceive: { total: 0, count: 0 },
    weekReceived: { total: 0, count: 0 },
    monthToReceive: { total: 0, count: 0 },
    overdue: { total: 0, count: 0 },
  };

  for (const row of rows) {
    const dueDate = parseDateOnly(row.dueDate);
    const isPaid = row.situation === "PAID";
    // Cancelada não é mais expectativa de recebimento: fica fora dos KPIs.
    const isOpen = !isPaid && row.situation !== "CANCELED";

    if (isOpen && isWithinInterval(dueDate, week)) {
      summary.weekToReceive.total += row.amount;
      summary.weekToReceive.count += 1;
    }

    if (row.paidAt && isWithinInterval(parseDateOnly(row.paidAt), week)) {
      summary.weekReceived.total += row.amount;
      summary.weekReceived.count += 1;
    }

    if (isOpen && isWithinInterval(dueDate, month)) {
      summary.monthToReceive.total += row.amount;
      summary.monthToReceive.count += 1;
    }

    if (row.situation === "OVERDUE") {
      summary.overdue.total += row.amount;
      summary.overdue.count += 1;
    }
  }

  return summary;
}

function toDetailLine(
  id: number,
  name: string,
  quantity: string,
  unitPrice: string,
  measureName: string | null,
): BudgetDetailLineType {
  const parsedQuantity = Number(quantity);
  const parsedUnitPrice = Number(unitPrice);

  return {
    id,
    name,
    quantity: parsedQuantity,
    unitPrice: parsedUnitPrice,
    total: parsedQuantity * parsedUnitPrice,
    measureName,
  };
}

function toSentPdfSummaries(sentPdfs: BudgetSentPdfResponseType[]) {
  return [...sentPdfs]
    .map((sentPdf) => ({
      id: sentPdf.id,
      version: sentPdf.version,
      fileName: sentPdf.fileName,
      sentAt: sentPdf.sentAt,
      clientTotal: Number(sentPdf.clientTotal),
    }))
    .sort((a, b) => b.version - a.version);
}

function toAttendanceDays(
  budget: BudgetResponseType,
): BudgetAttendanceDayDetailType[] {
  return [...budget.attendanceDays]
    .sort(
      (a, b) =>
        WEEK_DAY_ORDER.indexOf(a.weekDay) - WEEK_DAY_ORDER.indexOf(b.weekDay),
    )
    .map((day) => ({
      id: day.id,
      label: WEEK_DAY_LABEL[day.weekDay],
      startTime: day.startTime,
      endTime: day.endTime,
    }));
}

/** `allocations` vem achatado (uma linha por funcionário + data). */
function toEmployeers(budget: BudgetResponseType): BudgetEmployeerDetailType[] {
  const grouped = budget.allocations.reduce<
    Record<number, BudgetEmployeerDetailType>
  >((acc, allocation) => {
    const existing = acc[allocation.employeerId];

    if (existing) {
      existing.daysCount += 1;
      existing.total += Number(allocation.dailyRate);
      return acc;
    }

    const dailyRate = Number(allocation.dailyRate);

    acc[allocation.employeerId] = {
      id: allocation.employeerId,
      name: allocation.employeer?.name ?? "Funcionário",
      dailyRate,
      daysCount: 1,
      total: dailyRate,
    };
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
}

/**
 * Monta os detalhes exibidos no sheet a partir do `GET /budget`, que já traz
 * cliente, endereço, serviços e materiais aninhados — evita uma segunda busca.
 */
export function toBudgetDetail(
  budget: BudgetResponseType,
  sentPdfs: BudgetSentPdfResponseType[] = [],
): BudgetDetailType {
  const { address } = budget;

  return {
    id: budget.id,
    isCanceled: budget.status === "CANCELED",
    customerName: budget.customer.name,
    customerDocument: budget.customer.document,
    customerEmail: budget.customer.email || null,
    customerPhone: budget.customer.cellPhone || null,
    addressLabel: address
      ? `${address.street}, ${address.number} · ${address.neighborhood} · ${address.city}/${address.state}`
      : null,
    startDate: budget.startDate,
    endDate: budget.endDate,
    clientTotal: Number(budget.clientTotal),
    observation: budget.observation || null,
    paymentTypeLabel: PAYMENT_TYPE_LABEL[budget.paymentType],
    firstInstallmentDate: budget.firstInstallmentDate,
    installmentsCount: budget.installments.length,
    attendanceDays: toAttendanceDays(budget),
    employeers: toEmployeers(budget),
    services: budget.services.map((service) =>
      toDetailLine(
        service.id,
        service.serviceItem.name,
        service.quantity,
        service.unitPrice,
        service.serviceItem.measure?.name ?? null,
      ),
    ),
    materials: budget.materials.map((material) =>
      toDetailLine(
        material.id,
        material.material.name,
        material.quantity,
        material.unitPrice,
        material.material.measure?.name ?? null,
      ),
    ),
    sentPdfs: toSentPdfSummaries(sentPdfs),
  };
}

/** Documento de cada cliente, indexado por id, a partir dos orçamentos. */
export function buildDocumentByCustomerId(budgets: BudgetResponseType[]) {
  return new Map(
    budgets.map((budget) => [budget.customer.id, budget.customer.document]),
  );
}
