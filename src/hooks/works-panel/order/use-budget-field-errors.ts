"use client";

import { buildOrderPayload } from "@/lib/order/build-order-payload";
import { unmaskCurrency } from "@/lib/utils";
import { createBudgetSchema } from "@/schema/works-panel/order/create-budget";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

/** Campos do payload que ganham destaque de erro na tela. */
export type BudgetErrorField =
  | "customerId"
  | "addressId"
  | "startDate"
  | "endDate"
  | "attendanceDays"
  | "services"
  | "materials"
  | "employeers"
  | "pricing"
  | "firstInstallmentDate"
  | "installmentAmount"
  | "installments";

export type BudgetFieldErrors = Partial<Record<BudgetErrorField, string>>;

/**
 * Valida o orçamento e devolve o erro de cada campo. Só retorna algo depois da
 * primeira tentativa de confirmar — antes disso a tela não fica vermelha.
 */
export function useBudgetFieldErrors(): BudgetFieldErrors {
  const customerId = useNewOrderStore((state) => state.customerId);
  const addressId = useNewOrderStore((state) => state.addressId);
  const sourceOrderId = useNewOrderStore((state) => state.sourceOrderId);
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const attendanceDays = useNewOrderStore((state) => state.attendanceDays);
  const serviceRows = useNewOrderStore((state) => state.serviceRows);
  const materialRows = useNewOrderStore((state) => state.materialRows);
  const employeerRows = useNewOrderStore((state) => state.employeerRows);
  const paymentType = useNewOrderStore((state) => state.paymentType);
  const firstInstallmentDate = useNewOrderStore(
    (state) => state.firstInstallmentDate,
  );
  const installments = useNewOrderStore((state) => state.installments);
  const observation = useNewOrderStore((state) => state.observation);
  const getPricingSummary = useNewOrderStore(
    (state) => state.getPricingSummary,
  );
  const installmentAmount = useNewOrderStore(
    (state) => state.installmentAmount,
  );
  const installmentCount = useNewOrderStore((state) => state.installmentCount);
  const installmentMode = useNewOrderStore((state) => state.installmentMode);
  const hasSubmitted = useNewOrderStore((state) => state.hasSubmitted);

  if (!hasSubmitted) return {};

  const payload = buildOrderPayload({
    customerId,
    addressId,
    sourceOrderId,
    startDate,
    endDate,
    attendanceDays,
    serviceRows,
    materialRows,
    employeerRows,
    pricing: getPricingSummary(),
    paymentType,
    firstInstallmentDate,
    installments,
    observation,
  });

  const fieldErrors: BudgetFieldErrors = {};

  // Valor e quantidade não vão no payload — são parâmetros de geração. Exige
  // apenas o campo do modo escolhido.
  if (paymentType !== "single") {
    const missingAmount =
      installmentMode === "amount" && unmaskCurrency(installmentAmount) <= 0;
    const missingCount =
      installmentMode === "count" && Number(installmentCount || 0) <= 0;

    if (missingAmount || missingCount) {
      fieldErrors.installmentAmount = missingAmount
        ? "Informe o valor da parcela."
        : "Informe em quantas vezes dividir.";
    }
  }

  const parsed = createBudgetSchema.safeParse(payload);
  if (parsed.success) return fieldErrors;

  for (const issue of parsed.error.issues) {
    const [first, second] = issue.path.map(String);

    // `schedule` e `payment` agrupam campos que aparecem em seções diferentes.
    const field = first === "schedule" || first === "payment" ? second : first;

    if (field && !(field in fieldErrors)) {
      fieldErrors[field as BudgetErrorField] = issue.message;
    }
  }

  return fieldErrors;
}
