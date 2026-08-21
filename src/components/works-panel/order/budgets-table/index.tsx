"use client";

import { useEffect, useState } from "react";

import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { BudgetMobileCard } from "@/components/works-panel/order/budget-mobile-card";
import { BudgetsFilterSheet } from "@/components/works-panel/order/budgets-filter-sheet";
import { SearchBudgets } from "@/components/works-panel/order/search-budgets";
import { useBudgetsTable } from "@/hooks/works-panel/order/use-budgets-table";

const MOBILE_PAGE_SIZE = 10;

interface BudgetsTableProps {
  budgets: BudgetResponseType[];
  orders: OrderResponseType[];
}

export function BudgetsTable({ budgets, orders }: BudgetsTableProps) {
  const {
    search,
    setSearch,
    filteredRows,
    columns,
    filters,
    cancelDialog,
    rowActions,
  } = useBudgetsTable({ budgets, orders });

  const openInstallments = cancelDialog.budget?.openInstallmentsCount ?? 0;

  // No mobile os cards são altos: renderizamos por lote em vez de tudo de uma vez.
  const [mobileVisibleCount, setMobileVisibleCount] =
    useState(MOBILE_PAGE_SIZE);
  const visibleMobileRows = filteredRows.slice(0, mobileVisibleCount);
  const hasMoreMobileRows = filteredRows.length > visibleMobileRows.length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: volta ao primeiro lote sempre que o recorte muda (busca, filtro), não a cada render
  useEffect(() => {
    setMobileVisibleCount(MOBILE_PAGE_SIZE);
  }, [filteredRows.length]);

  return (
    <>
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
          <>
            {/* Tabela no desktop; no mobile um card com hierarquia própria — o
                card genérico empilharia as 8 colunas como pares label/valor. */}
            <div className="hidden md:block">
              <DataTable columns={columns} data={filteredRows} minWidth="81rem" />
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {visibleMobileRows.map((row) => (
                <BudgetMobileCard
                  key={row.key}
                  budget={row}
                  onView={rowActions.onView}
                  onCreateFromOrder={rowActions.onCreateFromOrder}
                  onDuplicate={rowActions.onDuplicate}
                  onCancel={rowActions.onCancel}
                />
              ))}

              {hasMoreMobileRows && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full cursor-pointer border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
                  onClick={() =>
                    setMobileVisibleCount(
                      (current) => current + MOBILE_PAGE_SIZE,
                    )
                  }
                >
                  Carregar mais (
                  {filteredRows.length - visibleMobileRows.length} restantes)
                </Button>
              )}
            </div>
          </>
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

      <ConfirmDialog
        open={cancelDialog.open}
        onOpenChange={cancelDialog.onOpenChange}
        title="Cancelar orçamento"
        description={
          cancelDialog.budget
            ? `O orçamento #${cancelDialog.budget.id} de ${cancelDialog.budget.customerName} será cancelado${
                openInstallments > 0
                  ? `, e ${openInstallments} ${openInstallments === 1 ? "parcela em aberto será cancelada" : "parcelas em aberto serão canceladas"} no financeiro`
                  : ""
              }. Parcelas já pagas são preservadas. Essa ação não pode ser desfeita.`
            : undefined
        }
        confirmLabel="Cancelar orçamento"
        cancelLabel="Voltar"
        variant="destructive"
        isLoading={cancelDialog.isLoading}
        onConfirm={cancelDialog.onConfirm}
      />
    </>
  );
}
