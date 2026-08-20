"use client";

import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { BudgetsFilterSheet } from "@/components/works-panel/order/budgets-filter-sheet";
import { SearchBudgets } from "@/components/works-panel/order/search-budgets";
import { useBudgetsTable } from "@/hooks/works-panel/order/use-budgets-table";

interface BudgetsTableProps {
  budgets: BudgetResponseType[];
  orders: OrderResponseType[];
}

export function BudgetsTable({ budgets, orders }: BudgetsTableProps) {
  const { search, setSearch, filteredRows, columns, filters } = useBudgetsTable(
    { budgets, orders },
  );

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <SearchBudgets value={search} onChange={setSearch} />
        </div>
        <BudgetsFilterSheet
          selectedOrigins={filters.selectedOrigins}
          selectedStatus={filters.selectedStatus}
          activeCount={filters.activeCount}
          onToggleOrigin={filters.toggleOrigin}
          onToggleStatus={filters.toggleStatus}
          onClear={filters.clearFilters}
        />
      </div>

      {filteredRows.length > 0 ? (
        <DataTable columns={columns} data={filteredRows} />
      ) : (
        <EmptyState
          icon="searchX"
          title="Nenhum orçamento encontrado"
          subtitle={
            search.trim()
              ? `Não encontramos resultados para "${search.trim()}".`
              : "Nenhum orçamento corresponde aos filtros selecionados."
          }
        />
      )}
    </div>
  );
}
