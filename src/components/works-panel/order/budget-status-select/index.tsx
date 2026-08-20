"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { BUDGET_STATUS_LABEL } from "@/lib/order/format-budget";

const STATUS_OPTIONS = (
  ["DRAFT", "SENT", "APPROVED", "REJECTED"] as BudgetStatus[]
).map((status) => ({ value: status, label: BUDGET_STATUS_LABEL[status] }));

async function updateBudgetStatus(budgetId: number, status: BudgetStatus) {
  const response = await fetch(`/api/works-panel/budget/${budgetId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Falha ao atualizar a situação");
  }

  return await response.json();
}

interface BudgetStatusSelectProps {
  budgetId: number;
  status: BudgetStatus;
}

export function BudgetStatusSelect({
  budgetId,
  status,
}: BudgetStatusSelectProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleChange(value: string | null) {
    if (!value || value === status) return;

    setIsPending(true);

    try {
      await toast.promise(updateBudgetStatus(budgetId, value as BudgetStatus), {
        loading: "Atualizando situação...",
        success: "Situação atualizada.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Não foi possível atualizar a situação.",
      });

      router.refresh();
    } catch {
      // O toast.promise já notificou o usuário.
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full sm:w-44">
      <SelectCombobox
        options={STATUS_OPTIONS}
        value={status}
        onChange={handleChange}
        placeholder="Situação"
        disabled={isPending}
      />
    </div>
  );
}
