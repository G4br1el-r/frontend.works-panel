"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { createBudgetsColumns } from "@/components/works-panel/order/budgets-table/columns";
import {
  type BudgetRow,
  type BudgetRowOrigin,
  mergeBudgetRows,
} from "@/lib/order/budget-row";

interface UseBudgetsTableOptions {
  budgets: BudgetResponseType[];
  orders: OrderResponseType[];
}

export function useBudgetsTable({ budgets, orders }: UseBudgetsTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOrigins, setSelectedOrigins] = useState<BudgetRowOrigin[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const rows = mergeBudgetRows(budgets, orders);
  const normalizedSearch = search.trim().toLowerCase();

  const filteredRows = rows.filter((row) => {
    const matchesOrigin =
      selectedOrigins.length === 0 || selectedOrigins.includes(row.origin);
    if (!matchesOrigin) return false;

    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(row.status);
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

  const columns = createBudgetsColumns({
    onView: handleView,
    onCreateFromOrder: handleCreateFromOrder,
    onDuplicate: handleDuplicate,
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
