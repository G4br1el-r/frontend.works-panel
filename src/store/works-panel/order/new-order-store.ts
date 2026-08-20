import toast from "react-hot-toast";
import { create } from "zustand";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import {
  formatCurrency,
  generateId,
  maskCurrency,
  unmaskCurrency,
} from "@/lib/utils";
import {
  generateInstallmentDueDates,
  getInstallmentCount,
  getInstallmentCountByAmount,
  type PaymentType,
  splitAmountByInstallment,
  splitAmountEqually,
} from "@/lib/utils/generate-installments";
import {
  countWeekDaysInPeriod,
  getAttendanceOccurrences,
} from "@/lib/utils/get-attendance-occurrences";

export interface ServiceFormRow {
  id: string;
  serviceItem: ServiceItemResponseType;
  quantity: string;
  unitPrice: string;
}

export const WEEK_DAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

export interface AttendanceSchedule {
  selected: boolean;
  startTime: string;
  endTime: string;
}

export type AttendanceDays = Record<WeekDay, AttendanceSchedule>;

/** As datas do backend vêm em ISO UTC; a tela usa dd/MM/yyyy. */
function isoToBrDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${date.getUTCFullYear()}`;
}

function createEmptyAttendanceDays(): AttendanceDays {
  return WEEK_DAYS.reduce((acc, day) => {
    acc[day] = { selected: false, startTime: "08:00", endTime: "17:00" };
    return acc;
  }, {} as AttendanceDays);
}

export interface MaterialFormRow {
  id: string;
  material: MaterialResponseType;
  quantity: string;
  unitPrice: string;
  sourceServiceRowIds: string[];
  /** Quantidade ajustada à mão: a sincronização com os serviços não a sobrescreve. */
  isQuantityManuallyEdited?: boolean;
}

export interface EmployeerFormRow {
  id: string;
  employeer: EmployeerResponseType;
  selectedDates: string[];
  dailyRate: string;
}

function getEmployeerSubtotalValue(row: EmployeerFormRow) {
  return unmaskCurrency(row.dailyRate) * row.selectedDates.length;
}

function getServiceSubtotalValue(row: ServiceFormRow) {
  return unmaskCurrency(row.unitPrice) * Number(row.quantity || 0);
}

function getMaterialSubtotalValue(row: MaterialFormRow) {
  return unmaskCurrency(row.unitPrice) * Number(row.quantity || 0);
}

function syncMaterialsFromServiceRows(
  serviceRows: ServiceFormRow[],
  currentMaterialRows: MaterialFormRow[],
): MaterialFormRow[] {
  const autoRowsByMaterialId = new Map<number, MaterialFormRow>();

  for (const serviceRow of serviceRows) {
    const serviceQuantity = Number(serviceRow.quantity || 0);

    for (const material of serviceRow.serviceItem.materials ?? []) {
      const existing = autoRowsByMaterialId.get(material.id);

      if (existing) {
        existing.sourceServiceRowIds.push(serviceRow.id);

        // Quantidade ajustada à mão não é recalculada pelos serviços.
        if (!existing.isQuantityManuallyEdited) {
          existing.quantity = String(
            Number(existing.quantity || 0) + serviceQuantity,
          );
        }
        continue;
      }

      const existingRow = currentMaterialRows.find(
        (row) => row.material.id === material.id,
      );

      autoRowsByMaterialId.set(material.id, {
        id: existingRow?.id ?? generateId(),
        material,
        quantity: existingRow?.isQuantityManuallyEdited
          ? existingRow.quantity
          : String(serviceQuantity),
        unitPrice:
          existingRow?.unitPrice ?? maskCurrency(Number(material.basePrice)),
        sourceServiceRowIds: [serviceRow.id],
        isQuantityManuallyEdited: existingRow?.isQuantityManuallyEdited,
      });
    }
  }

  const autoRows = Array.from(autoRowsByMaterialId.values());
  const autoMaterialIds = new Set(autoRows.map((row) => row.material.id));
  const manualRows = currentMaterialRows.filter(
    (row) =>
      row.sourceServiceRowIds.length === 0 &&
      !autoMaterialIds.has(row.material.id),
  );

  return [...autoRows, ...manualRows];
}

/**
 * Desmarca os dias da semana que não ocorrem mais no período da obra. Ex: obra
 * de 18/08 a 18/08 só tem terça — qualquer outro dia marcado antes vira ruído.
 */
function revalidateAttendanceDays(
  attendanceDays: AttendanceDays,
  startDate: string,
  endDate: string,
): AttendanceDays {
  const counts = countWeekDaysInPeriod(startDate, endDate);

  return WEEK_DAYS.reduce((acc, day) => {
    acc[day] =
      counts[day] > 0
        ? attendanceDays[day]
        : { ...attendanceDays[day], selected: false };
    return acc;
  }, {} as AttendanceDays);
}

/**
 * Parcelas geradas valem para um valor específico: qualquer mudança de serviço,
 * material, funcionário ou precificação as invalida. Melhor descartar do que
 * salvar um parcelamento que não soma o total do orçamento.
 */
function discardInstallments(installments: InstallmentRow[]) {
  if (installments.length === 0) return {};

  toast("O valor mudou — gere as parcelas novamente.", {
    id: "installments-outdated",
  });

  return { installments: [] };
}

/**
 * Remove das linhas de funcionários as datas que deixaram de existir no período
 * da obra (prazo + dias de atendimento). Funcionários que ficam sem nenhuma data
 * válida são descartados.
 */
function revalidateEmployeerRows(
  employeerRows: EmployeerFormRow[],
  startDate: string,
  endDate: string,
  attendanceDays: AttendanceDays,
): EmployeerFormRow[] {
  if (employeerRows.length === 0) return employeerRows;

  const validDateKeys = new Set(
    getAttendanceOccurrences(startDate, endDate, attendanceDays).map(
      (occurrence) => occurrence.date.toISOString().slice(0, 10),
    ),
  );

  return employeerRows
    .map((row) => ({
      ...row,
      selectedDates: row.selectedDates.filter((dateKey) =>
        validDateKeys.has(dateKey),
      ),
    }))
    .filter((row) => row.selectedDates.length > 0);
}

/** Avisa quando a mudança de período afetou os funcionários já cadastrados. */
function warnIfEmployeerDatesChanged(
  before: EmployeerFormRow[],
  after: EmployeerFormRow[],
) {
  const removedRows = before.length - after.length;

  if (removedRows > 0) {
    toast.error(
      removedRows > 1
        ? `${removedRows} funcionários removidos: os dias deles não existem mais no novo período.`
        : "Funcionário removido: os dias dele não existem mais no novo período.",
      { id: "employeer-rows-revalidated" },
    );
    return;
  }

  const datesBefore = before.reduce(
    (sum, row) => sum + row.selectedDates.length,
    0,
  );
  const datesAfter = after.reduce(
    (sum, row) => sum + row.selectedDates.length,
    0,
  );
  const removedDates = datesBefore - datesAfter;

  if (removedDates > 0) {
    toast.error(
      removedDates > 1
        ? `${removedDates} dias de trabalho foram removidos por ficarem fora do novo período.`
        : "1 dia de trabalho foi removido por ficar fora do novo período.",
      { id: "employeer-rows-revalidated" },
    );
  }
}

export interface PricingSummary {
  serviceSubtotal: number;
  materialSubtotal: number;
  employeerSubtotal: number;
  costTotal: number;
  baseAmount: number;
  marginAmount: number;
  absorbCost: boolean;
  profitMargin: number;
  netProfitAmount: number;
  clientTotal: number;
}

/** Divide pelo valor de cada parcela ou pela quantidade de parcelas. */
export type InstallmentMode = "amount" | "count";

export interface InstallmentRow {
  id: string;
  number: number;
  dueDate: Date;
  amount: number;
  isManuallyEdited: boolean;
}

interface NewOrderState {
  /** Zera o formulário. Chamado ao abrir a tela, para não herdar o orçamento anterior. */
  resetForm: () => void;
  customerId: string | null;
  /** Preenchido quando o orçamento nasce de um pedido do site. */
  sourceOrderId: number | null;
  hydrateFromOrder: (
    order: OrderResponseType,
    catalog: ServiceItemResponseType[],
  ) => void;
  /** Carrega um orçamento existente para editar ou duplicar. */
  hydrateFromBudget: (
    budget: BudgetResponseType,
    catalog: ServiceItemResponseType[],
    options?: { keepId?: boolean },
  ) => void;
  /** Id do orçamento em edição. Nulo quando é criação ou duplicação. */
  editingBudgetId: number | null;
  addressId: string | null;
  setCustomerId: (value: string | null) => void;
  setAddressId: (value: string | null) => void;
  startDate: string;
  endDate: string;
  attendanceDays: AttendanceDays;
  absorbCost: boolean;
  profitMargin: string;
  setAbsorbCost: (value: boolean) => void;
  setProfitMargin: (value: string) => void;
  getPricingSummary: () => PricingSummary;
  paymentType: PaymentType;
  firstInstallmentDate: string;
  installments: InstallmentRow[];
  setPaymentType: (value: PaymentType) => void;
  setFirstInstallmentDate: (value: string) => void;
  /** Como dividir: pelo valor de cada parcela ou pela quantidade delas. */
  installmentMode: InstallmentMode;
  setInstallmentMode: (value: InstallmentMode) => void;
  /** Valor de cada parcela (mascarado). Usado quando o modo é "amount". */
  installmentAmount: string;
  setInstallmentAmount: (value: string) => void;
  /** Quantidade de parcelas. Usada quando o modo é "count". */
  installmentCount: string;
  setInstallmentCount: (value: string) => void;
  generateInstallments: () => void;
  updateInstallmentDueDate: (id: string, dueDate: Date) => void;
  observation: string;
  setObservation: (value: string) => void;
  /** Só marca os campos em vermelho depois da primeira tentativa de confirmar. */
  hasSubmitted: boolean;
  setHasSubmitted: (value: boolean) => void;
  updateInstallmentAmount: (id: string, amount: number) => void;
  removeInstallment: (id: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  toggleAttendanceDay: (day: WeekDay) => void;
  selectAttendanceDayGroup: (days: WeekDay[]) => void;
  clearAttendanceDays: () => void;
  setAttendanceTime: (
    day: WeekDay,
    field: "startTime" | "endTime",
    value: string,
  ) => void;
  serviceRows: ServiceFormRow[];
  materialRows: MaterialFormRow[];
  isServiceSheetOpen: boolean;
  isMaterialSheetOpen: boolean;
  openServiceSheet: () => void;
  closeServiceSheet: () => void;
  openMaterialSheet: () => void;
  closeMaterialSheet: () => void;
  addServiceRows: (newRows: ServiceFormRow[]) => void;
  removeServiceRow: (id: string) => void;
  updateServiceRow: (
    id: string,
    changes: Partial<Pick<ServiceFormRow, "quantity" | "unitPrice">>,
  ) => void;
  addMaterialRows: (
    newRows: Omit<MaterialFormRow, "sourceServiceRowIds">[],
  ) => void;
  removeMaterialRow: (id: string) => void;
  updateMaterialRow: (
    id: string,
    changes: Partial<Pick<MaterialFormRow, "quantity" | "unitPrice">>,
  ) => void;
  employeerRows: EmployeerFormRow[];
  isEmployeerSheetOpen: boolean;
  openEmployeerSheet: () => void;
  closeEmployeerSheet: () => void;
  addEmployeerRows: (newRows: EmployeerFormRow[]) => void;
  removeEmployeerRow: (id: string) => void;
  updateEmployeerRow: (
    id: string,
    changes: Partial<Pick<EmployeerFormRow, "selectedDates" | "dailyRate">>,
  ) => void;
  getServiceSubtotal: (row: ServiceFormRow) => string;
  getMaterialSubtotal: (row: MaterialFormRow) => string;
  getEmployeerSubtotal: (row: EmployeerFormRow) => string;
  serviceTotalAmount: () => string;
  materialTotalAmount: () => string;
  employeerTotalAmount: () => string;
}

/**
 * Estado de um orçamento em branco. A store é um singleton de módulo e
 * sobrevive à navegação, então a tela precisa restaurar isto ao abrir.
 */
function createEmptyOrderState() {
  return {
    customerId: null,
    sourceOrderId: null,
    editingBudgetId: null,
    addressId: null,
    startDate: "",
    endDate: "",
    attendanceDays: createEmptyAttendanceDays(),
    absorbCost: false,
    profitMargin: "",
    paymentType: "single" as PaymentType,
    firstInstallmentDate: "",
    installmentMode: "amount" as InstallmentMode,
    installmentAmount: "",
    installmentCount: "",
    installments: [] as InstallmentRow[],
    observation: "",
    hasSubmitted: false,
    serviceRows: [] as ServiceFormRow[],
    materialRows: [] as MaterialFormRow[],
    isServiceSheetOpen: false,
    isMaterialSheetOpen: false,
    employeerRows: [] as EmployeerFormRow[],
    isEmployeerSheetOpen: false,
  };
}

export const useNewOrderStore = create<NewOrderState>((set, get) => ({
  ...createEmptyOrderState(),

  resetForm: () => set(createEmptyOrderState()),

  setCustomerId: (value) => set({ customerId: value, addressId: null }),

  /**
   * Traz do pedido do site o que o cliente já escolheu: cliente, endereço e
   * serviços. Prazo, precificação e parcelas seguem em branco — são decisão
   * do painel. `catalog` completa medida/segmento, que o pedido não traz.
   */
  hydrateFromOrder: (order, catalog) => {
    const serviceItemById = new Map(
      catalog.map((serviceItem) => [serviceItem.id, serviceItem]),
    );

    const serviceRows: ServiceFormRow[] = (order.items ?? []).map((item) => {
      const fromCatalog = serviceItemById.get(item.serviceItemId);

      return {
        id: generateId(),
        serviceItem:
          fromCatalog ??
          ({
            ...item.serviceItem,
            measure: null,
            segment: null,
          } as ServiceItemResponseType),
        quantity: String(Number(item.quantity) || 1),
        unitPrice: maskCurrency(Number(item.price)),
      };
    });

    set((state) => ({
      sourceOrderId: order.id,
      customerId: String(order.customerId),
      addressId: String(order.addressId),
      serviceRows,
      materialRows: syncMaterialsFromServiceRows(
        serviceRows,
        state.materialRows,
      ),
    }));
  },

  /**
   * Carrega um orçamento existente no formulário. Com `keepId`, é edição
   * (salva por PUT); sem, é duplicação (salva por POST como novo).
   */
  hydrateFromBudget: (budget, catalog, options) => {
    const attendanceDays = createEmptyAttendanceDays();

    for (const day of budget.attendanceDays) {
      attendanceDays[day.weekDay] = {
        selected: true,
        startTime: day.startTime,
        endTime: day.endTime,
      };
    }

    // O GET /budget não traz `materials` dentro de `serviceItem`; sem a versão
    // do catálogo, sincronizar materiais quebraria ao editar os serviços.
    const catalogById = new Map(catalog.map((item) => [item.id, item]));

    const serviceRows: ServiceFormRow[] = budget.services.map((service) => ({
      id: generateId(),
      serviceItem: {
        ...service.serviceItem,
        materials:
          catalogById.get(service.serviceItemId)?.materials ??
          service.serviceItem.materials ??
          [],
      },
      quantity: String(Number(service.quantity)),
      unitPrice: maskCurrency(Number(service.unitPrice)),
    }));

    // O vínculo material→serviço vem por serviceItemId; a store usa o id da linha.
    const rowIdByServiceItemId = new Map(
      serviceRows.map((row) => [row.serviceItem.id, row.id]),
    );

    // Quanto os serviços gerariam sozinhos para cada material — se o salvo
    // difere, alguém ajustou à mão e a sincronização não pode desfazer isso.
    const autoQuantityByMaterialId = new Map<number, number>();

    for (const serviceRow of serviceRows) {
      const serviceQuantity = Number(serviceRow.quantity || 0);

      for (const material of serviceRow.serviceItem.materials ?? []) {
        autoQuantityByMaterialId.set(
          material.id,
          (autoQuantityByMaterialId.get(material.id) ?? 0) + serviceQuantity,
        );
      }
    }

    const materialRows: MaterialFormRow[] = budget.materials.map((material) => {
      const quantity = Number(material.quantity);
      const autoQuantity = autoQuantityByMaterialId.get(material.material.id);

      return {
        id: generateId(),
        material: material.material,
        quantity: String(quantity),
        unitPrice: maskCurrency(Number(material.unitPrice)),
        sourceServiceRowIds: material.fromServiceItems
          .map((link) => rowIdByServiceItemId.get(link.serviceItemId))
          .filter((rowId): rowId is string => rowId !== undefined),
        isQuantityManuallyEdited:
          autoQuantity !== undefined && autoQuantity !== quantity,
      };
    });

    // `allocations` vem achatado: uma linha por funcionário+data.
    const employeerRows: EmployeerFormRow[] = Object.values(
      budget.allocations.reduce<Record<number, EmployeerFormRow>>(
        (acc, allocation) => {
          const dateKey = allocation.date.slice(0, 10);
          const existing = acc[allocation.employeerId];

          if (existing) {
            existing.selectedDates.push(dateKey);
            return acc;
          }

          acc[allocation.employeerId] = {
            id: generateId(),
            employeer: allocation.employeer,
            selectedDates: [dateKey],
            dailyRate: maskCurrency(Number(allocation.dailyRate)),
          };
          return acc;
        },
        {},
      ),
    );

    set({
      editingBudgetId: options?.keepId ? budget.id : null,
      sourceOrderId: budget.sourceOrderId,
      customerId: String(budget.customerId),
      addressId: String(budget.addressId),
      startDate: isoToBrDate(budget.startDate),
      endDate: isoToBrDate(budget.endDate),
      attendanceDays,
      serviceRows,
      materialRows,
      employeerRows,
      absorbCost: budget.absorbCost,
      profitMargin: String(Number(budget.profitMargin)),
      paymentType: budget.paymentType.toLowerCase() as PaymentType,
      firstInstallmentDate: isoToBrDate(budget.firstInstallmentDate),
      installments: budget.installments.map((installment) => ({
        id: generateId(),
        number: installment.number,
        dueDate: new Date(installment.dueDate),
        amount: Number(installment.amount),
        isManuallyEdited: installment.isManuallyEdited,
      })),
      observation: budget.observation ?? "",
      hasSubmitted: false,
    });
  },

  setAddressId: (value) => set({ addressId: value }),

  setStartDate: (value) => {
    const before = get().employeerRows;
    set((state) => {
      const attendanceDays = revalidateAttendanceDays(
        state.attendanceDays,
        value,
        state.endDate,
      );

      return {
        startDate: value,
        attendanceDays,
        employeerRows: revalidateEmployeerRows(
          state.employeerRows,
          value,
          state.endDate,
          attendanceDays,
        ),
      };
    });
    warnIfEmployeerDatesChanged(before, get().employeerRows);
  },

  setEndDate: (value) => {
    const before = get().employeerRows;
    set((state) => {
      const attendanceDays = revalidateAttendanceDays(
        state.attendanceDays,
        state.startDate,
        value,
      );

      return {
        endDate: value,
        attendanceDays,
        employeerRows: revalidateEmployeerRows(
          state.employeerRows,
          state.startDate,
          value,
          attendanceDays,
        ),
      };
    });
    warnIfEmployeerDatesChanged(before, get().employeerRows);
  },

  toggleAttendanceDay: (day) => {
    const before = get().employeerRows;
    set((state) => {
      const attendanceDays = {
        ...state.attendanceDays,
        [day]: {
          ...state.attendanceDays[day],
          selected: !state.attendanceDays[day].selected,
        },
      };

      return {
        attendanceDays,
        employeerRows: revalidateEmployeerRows(
          state.employeerRows,
          state.startDate,
          state.endDate,
          attendanceDays,
        ),
      };
    });
    warnIfEmployeerDatesChanged(before, get().employeerRows);
  },

  selectAttendanceDayGroup: (days) => {
    const before = get().employeerRows;
    set((state) => {
      const attendanceDays = createEmptyAttendanceDays();

      for (const day of days) {
        attendanceDays[day] = { ...state.attendanceDays[day], selected: true };
      }

      return {
        attendanceDays,
        employeerRows: revalidateEmployeerRows(
          state.employeerRows,
          state.startDate,
          state.endDate,
          attendanceDays,
        ),
      };
    });
    warnIfEmployeerDatesChanged(before, get().employeerRows);
  },

  clearAttendanceDays: () => {
    set((state) => {
      const attendanceDays = createEmptyAttendanceDays();

      return {
        attendanceDays,
        employeerRows: revalidateEmployeerRows(
          state.employeerRows,
          state.startDate,
          state.endDate,
          attendanceDays,
        ),
      };
    });
    toast.success("Dias e horários limpos.", { id: "clear-attendance-days" });
  },

  setAttendanceTime: (day, field, value) => {
    set((state) => ({
      attendanceDays: {
        ...state.attendanceDays,
        [day]: { ...state.attendanceDays[day], [field]: value },
      },
    }));
  },

  openServiceSheet: () => set({ isServiceSheetOpen: true }),
  closeServiceSheet: () => set({ isServiceSheetOpen: false }),
  openMaterialSheet: () => set({ isMaterialSheetOpen: true }),
  closeMaterialSheet: () => set({ isMaterialSheetOpen: false }),

  addServiceRows: (newRows) => {
    set((state) => {
      const serviceRows = [...state.serviceRows, ...newRows];
      return {
        serviceRows,
        materialRows: syncMaterialsFromServiceRows(
          serviceRows,
          state.materialRows,
        ),
        isServiceSheetOpen: false,
        ...discardInstallments(state.installments),
      };
    });
    toast.success(
      newRows.length > 1
        ? `${newRows.length} serviços adicionados.`
        : "Serviço adicionado.",
      {
        id: "add-service-item",
      },
    );
  },

  removeServiceRow: (id) => {
    set((state) => {
      const serviceRows = state.serviceRows.filter((row) => row.id !== id);
      return {
        serviceRows,
        materialRows: syncMaterialsFromServiceRows(
          serviceRows,
          state.materialRows,
        ),
        ...discardInstallments(state.installments),
      };
    });
    toast.success("Serviço removido.", { id: "remove-service-item" });
  },

  updateServiceRow: (id, changes) => {
    set((state) => {
      const serviceRows = state.serviceRows.map((row) =>
        row.id === id ? { ...row, ...changes } : row,
      );
      return {
        serviceRows,
        materialRows: syncMaterialsFromServiceRows(
          serviceRows,
          state.materialRows,
        ),
        ...discardInstallments(state.installments),
      };
    });
  },

  addMaterialRows: (newRows) => {
    set((state) => ({
      materialRows: [
        ...state.materialRows,
        ...newRows.map((row) => ({ ...row, sourceServiceRowIds: [] })),
      ],
      isMaterialSheetOpen: false,
      ...discardInstallments(state.installments),
    }));
    toast.success(
      newRows.length > 1
        ? `${newRows.length} materiais adicionados.`
        : "Material adicionado.",
      {
        id: "add-material-item",
      },
    );
  },

  removeMaterialRow: (id) => {
    set((state) => ({
      materialRows: state.materialRows.filter((row) => row.id !== id),
      ...discardInstallments(state.installments),
    }));
    toast.success("Material removido.", { id: "remove-material-item" });
  },

  updateMaterialRow: (id, changes) => {
    set((state) => ({
      materialRows: state.materialRows.map((row) =>
        row.id === id
          ? {
              ...row,
              ...changes,
              // Marca a edição manual para a sincronização não desfazer.
              isQuantityManuallyEdited:
                changes.quantity !== undefined
                  ? true
                  : row.isQuantityManuallyEdited,
            }
          : row,
      ),
      ...discardInstallments(state.installments),
    }));
  },

  openEmployeerSheet: () => set({ isEmployeerSheetOpen: true }),
  closeEmployeerSheet: () => set({ isEmployeerSheetOpen: false }),

  addEmployeerRows: (newRows) => {
    set((state) => ({
      employeerRows: [...state.employeerRows, ...newRows],
      isEmployeerSheetOpen: false,
      ...discardInstallments(state.installments),
    }));
    toast.success(
      newRows.length > 1
        ? `${newRows.length} funcionários adicionados.`
        : "Funcionário adicionado.",
      {
        id: "add-employeer-item",
      },
    );
  },

  removeEmployeerRow: (id) => {
    set((state) => ({
      employeerRows: state.employeerRows.filter((row) => row.id !== id),
      ...discardInstallments(state.installments),
    }));
    toast.success("Funcionário removido.", { id: "remove-employeer-item" });
  },

  updateEmployeerRow: (id, changes) => {
    set((state) => ({
      employeerRows: state.employeerRows.map((row) =>
        row.id === id ? { ...row, ...changes } : row,
      ),
      ...discardInstallments(state.installments),
    }));
  },

  getServiceSubtotal: (row) => formatCurrency(getServiceSubtotalValue(row)),
  getMaterialSubtotal: (row) => formatCurrency(getMaterialSubtotalValue(row)),
  getEmployeerSubtotal: (row) => formatCurrency(getEmployeerSubtotalValue(row)),

  serviceTotalAmount: () =>
    formatCurrency(
      get().serviceRows.reduce(
        (sum, row) => sum + getServiceSubtotalValue(row),
        0,
      ),
    ),
  materialTotalAmount: () =>
    formatCurrency(
      get().materialRows.reduce(
        (sum, row) => sum + getMaterialSubtotalValue(row),
        0,
      ),
    ),
  employeerTotalAmount: () =>
    formatCurrency(
      get().employeerRows.reduce(
        (sum, row) => sum + getEmployeerSubtotalValue(row),
        0,
      ),
    ),

  setAbsorbCost: (value) =>
    set((state) => ({
      absorbCost: value,
      ...discardInstallments(state.installments),
    })),
  setProfitMargin: (value) =>
    set((state) => ({
      profitMargin: value,
      ...discardInstallments(state.installments),
    })),

  getPricingSummary: () => {
    const state = get();

    const serviceSubtotal = state.serviceRows.reduce(
      (sum, row) => sum + getServiceSubtotalValue(row),
      0,
    );
    const materialSubtotal = state.materialRows.reduce(
      (sum, row) => sum + getMaterialSubtotalValue(row),
      0,
    );
    const employeerSubtotal = state.employeerRows.reduce(
      (sum, row) => sum + getEmployeerSubtotalValue(row),
      0,
    );
    const costTotal = materialSubtotal + employeerSubtotal;

    const profitMargin = Number(state.profitMargin || 0);
    const baseAmount = serviceSubtotal;
    const marginAmount = baseAmount * (profitMargin / 100);
    const billedAmount = baseAmount + marginAmount;

    const clientTotal = state.absorbCost
      ? billedAmount
      : billedAmount + costTotal;
    const netProfitAmount = clientTotal - costTotal;

    return {
      serviceSubtotal,
      materialSubtotal,
      employeerSubtotal,
      costTotal,
      baseAmount,
      marginAmount,
      absorbCost: state.absorbCost,
      profitMargin,
      netProfitAmount,
      clientTotal,
    };
  },

  setPaymentType: (value) =>
    // Trocar a frequência invalida as parcelas: recomeça do zero.
    set((state) => ({
      paymentType: value,
      installments: [],
      // Pagamento único não parcela: valor e quantidade deixam de fazer sentido.
      installmentAmount: value === "single" ? "" : state.installmentAmount,
      installmentCount: value === "single" ? "" : state.installmentCount,
    })),
  setFirstInstallmentDate: (value) => set({ firstInstallmentDate: value }),
  // Trocar o modo zera o campo do outro: só um deles vale por vez.
  setInstallmentMode: (value) =>
    set({
      installmentMode: value,
      installmentAmount: "",
      installmentCount: "",
      installments: [],
    }),
  setInstallmentAmount: (value) => set({ installmentAmount: value }),
  setInstallmentCount: (value) => set({ installmentCount: value }),
  setObservation: (value) => set({ observation: value }),
  setHasSubmitted: (value) => set({ hasSubmitted: value }),

  generateInstallments: () => {
    const state = get();
    const { clientTotal } = state.getPricingSummary();
    const fixedAmount = unmaskCurrency(state.installmentAmount);
    const fixedCount = Number(state.installmentCount || 0);
    const byAmount = state.installmentMode === "amount";

    // O modo escolhido decide; sem valor preenchido, cai no período × frequência.
    // Nos dois primeiros casos a cobrança pode ultrapassar o fim da obra.
    const count =
      state.paymentType === "single"
        ? 1
        : byAmount && fixedAmount > 0
          ? getInstallmentCountByAmount(clientTotal, fixedAmount)
          : !byAmount && fixedCount > 0
            ? fixedCount
            : getInstallmentCount(
                state.startDate,
                state.endDate,
                state.firstInstallmentDate,
                state.paymentType,
              );

    if (count <= 0 || !state.firstInstallmentDate) {
      toast.error("Defina o prazo da obra e a data de pagamento.", {
        id: "generate-installments",
      });
      return;
    }

    const dueDates = generateInstallmentDueDates(
      state.firstInstallmentDate,
      state.paymentType,
      count,
    );

    const amounts =
      state.paymentType !== "single" && byAmount && fixedAmount > 0
        ? splitAmountByInstallment(clientTotal, fixedAmount)
        : splitAmountEqually(clientTotal, count);

    const installments: InstallmentRow[] = dueDates.map((dueDate, index) => ({
      id: generateId(),
      number: index + 1,
      dueDate,
      amount: amounts[index],
      isManuallyEdited: false,
    }));

    set({
      installments,
      // Reflete nos campos o que de fato foi gerado, para não ficar incoerente
      // com a lista (ex: pediu 10x mas o valor da parcela rendeu 34).
      installmentCount: state.paymentType === "single" ? "" : String(count),
      installmentAmount:
        state.paymentType === "single" ? "" : maskCurrency(amounts[0]),
    });
    toast.success("Parcelas geradas.", { id: "generate-installments" });
  },

  updateInstallmentDueDate: (id, dueDate) => {
    set((state) => ({
      installments: state.installments.map((row) =>
        row.id === id ? { ...row, dueDate } : row,
      ),
    }));
  },

  updateInstallmentAmount: (id, amount) => {
    set((state) => {
      const { clientTotal } = state.getPricingSummary();
      const editedRow = state.installments.find((row) => row.id === id);
      if (!editedRow) return {};

      const clampedAmount = Math.max(0, amount);
      const otherRows = state.installments.filter((row) => row.id !== id);
      const remaining = Math.max(0, clientTotal - clampedAmount);
      const redistributed = splitAmountEqually(remaining, otherRows.length);

      let otherIndex = 0;
      const installments = state.installments.map((row) => {
        if (row.id === id)
          return { ...row, amount: clampedAmount, isManuallyEdited: true };
        const value = redistributed[otherIndex];
        otherIndex += 1;
        return { ...row, amount: value };
      });

      return { installments };
    });
  },

  removeInstallment: (id) => {
    set((state) => {
      const { clientTotal } = state.getPricingSummary();
      const remainingRows = state.installments.filter((row) => row.id !== id);
      const amounts = splitAmountEqually(clientTotal, remainingRows.length);

      const installments = remainingRows.map((row, index) => ({
        ...row,
        number: index + 1,
        amount: amounts[index],
      }));

      return { installments };
    });
    toast.success("Parcela removida.", { id: "remove-installment" });
  },
}));
