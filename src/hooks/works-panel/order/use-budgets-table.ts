"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { createBudgetsColumns } from "@/components/works-panel/order/budgets-table/columns";
import {
  type BudgetRow,
  type BudgetRowOrigin,
  mergeBudgetRows,
} from "@/lib/order/budget-row";
import { resolveUnifiedStatus } from "@/lib/order/format-budget";

async function cancelBudget(budgetId: number) {
  const response = await fetch(`/api/works-panel/budget/${budgetId}/cancel`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Falha ao cancelar o orçamento");
  }

  return await response.json();
}

interface UseBudgetsTableOptions {
  budgets: BudgetResponseType[];
  orders: OrderResponseType[];
}

export function useBudgetsTable({ budgets, orders }: UseBudgetsTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState<BudgetRowOrigin[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [budgetToCancel, setBudgetToCancel] = useState<BudgetRow | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  const rows = mergeBudgetRows(budgets, orders);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const matchesOrigin =
      selectedOrigins.length === 0 || selectedOrigins.includes(row.origin);
    if (!matchesOrigin) return false;

    const matchesStatus =
      selectedStatus.length === 0 ||
      resolveUnifiedStatus(selectedStatus).includes(row.status);
    if (!matchesStatus) return false;

    if (!normalizedSearch) return true;

    const haystack = [row.customerName, row.addressLabel, String(row.id)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  function handleView(row: BudgetRow) {
    router.push(row.href);
  }

  function handleCreateFromOrder(row: BudgetRow) {
    router.push(`/gestao-obras/orcamentos/novo?pedido=${row.id}`);
  }

  function handleDuplicate(row: BudgetRow) {
    router.push(`/gestao-obras/orcamentos/novo?duplicar=${row.id}`);
  }

  async function handleConfirmCancel() {
    if (!budgetToCancel) return;

    setIsCanceling(true);

    try {
      await toast.promise(cancelBudget(budgetToCancel.id), {
        loading: "Cancelando orçamento...",
        success: "Orçamento cancelado.",
        error: (error) =>
          error instanceof Error
            ? error.message
            : "Não foi possível cancelar o orçamento.",
      });

      router.refresh();
      setBudgetToCancel(null);
    } catch {
      // O toast.promise já notificou o usuário.
    } finally {
      setIsCanceling(false);
    }
  }

  const columns = createBudgetsColumns({
    onView: handleView,
    onCreateFromOrder: handleCreateFromOrder,
    onDuplicate: handleDuplicate,
    onCancel: setBudgetToCancel,
  });

  function toggleOrigin(origin: BudgetRowOrigin) {
    setSelectedOrigins((current) =>
      current.includes(origin)
        ? current.filter((entry) => entry !== origin)
        : [...current, origin],
    );
  }

  function toggleStatus(status: string) {
    setSelectedStatus((current) =>
      current.includes(status)
        ? current.filter((entry) => entry !== status)
        : [...current, status],
    );
  }

  function clearFilters() {
    setSelectedOrigins([]);
    setSelectedStatus([]);
  }

  return {
    search,
    setSearch,
    filteredRows,
    columns,
    /** Mesmas ações das colunas, para o card mobile reaproveitar. */
    rowActions: {
      onView: handleView,
      onCreateFromOrder: handleCreateFromOrder,
      onDuplicate: handleDuplicate,
      onCancel: setBudgetToCancel,
    },
    cancelDialog: {
      open: budgetToCancel !== null,
      budget: budgetToCancel,
      isLoading: isCanceling,
      onOpenChange: (open: boolean) => !open && setBudgetToCancel(null),
      onConfirm: handleConfirmCancel,
    },
    filters: {
      selectedOrigins,
      selectedStatus,
      toggleOrigin,
      toggleStatus,
      clearFilters,
      activeCount: selectedOrigins.length + selectedStatus.length,
    },
  };
}
