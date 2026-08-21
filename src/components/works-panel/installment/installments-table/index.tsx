"use client";

import type {
  BudgetDetailType,
  InstallmentRowType,
} from "@/@type/works-panel/installment/get-installment.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { InputComponent } from "@/components/shared/input-component";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { DueDateFilter } from "@/components/works-panel/installment/due-date-filter";
import { FilteredSummaryBar } from "@/components/works-panel/installment/filtered-summary-bar";
import { InstallmentDetailSheet } from "@/components/works-panel/installment/installment-detail-sheet";
import {
  SITUATION_FILTER_OPTIONS,
  useInstallmentsTable,
} from "@/hooks/works-panel/installment/use-installments-table";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDueDate } from "@/lib/utils/installment";

interface InstallmentsTableProps {
  installments: InstallmentRowType[];
  /** Detalhes por orçamento, montados no servidor para o sheet abrir na hora. */
  budgetDetails: Record<number, BudgetDetailType>;
}

function describeInstallment(installment: InstallmentRowType) {
  return `parcela ${installment.number}/${installment.totalInstallments} do orçamento #${installment.budgetId}, de ${installment.customerName}, no valor de ${formatCurrency(installment.amount)} com vencimento em ${formatDueDate(installment.dueDate)}`;
}

export function InstallmentsTable({
  installments,
  budgetDetails,
}: InstallmentsTableProps) {
  const {
    filters,
    filteredInstallments,
    filteredTotals,
    columns,
    detailSheet,
    payDialog,
    unpayDialog,
  } = useInstallmentsTable({ installments });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <InputComponent.root className="w-full items-start lg:max-w-sm">
            <InputComponent.wrapper
              iconName="search"
              classNameWrapper="h-10 w-full rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
              classNameIcon="text-panel-muted-foreground"
            >
              <InputComponent.inputBase
                id="search-installments"
                type="text"
                placeHolder="Buscar por cliente, documento ou orçamento..."
                value={filters.search}
                onChange={(event) => filters.setSearch(event.target.value)}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            </InputComponent.wrapper>
          </InputComponent.root>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:shrink-0">
            <div className="w-full sm:w-52">
              <DueDateFilter
                value={filters.dueDate}
                onChange={filters.setDueDate}
              />
            </div>
            <div className="w-full sm:w-56">
              <SelectCombobox
                id="filter-situation"
                options={[...SITUATION_FILTER_OPTIONS]}
                value={filters.situation}
                onChange={(value) =>
                  filters.setSituation(
                    (value as typeof filters.situation | null) ?? "ALL",
                  )
                }
                placeholder="Todas"
                searchPlaceholder="Buscar situação..."
                emptyMessage="Nenhuma situação encontrada."
              />
            </div>
          </div>
        </div>

        {filteredInstallments.length > 0 ? (
          <>
            <FilteredSummaryBar
              totals={filteredTotals}
              isFiltered={filters.hasActiveFilters}
            />
            <DataTable
              columns={columns}
              data={filteredInstallments}
              rowClassName={(installment) =>
                installment.situation === "CANCELED"
                  ? "bg-panel-page/40 text-panel-muted-foreground opacity-60"
                  : undefined
              }
            />
          </>
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhuma parcela encontrada"
            subtitle={
              filters.hasActiveFilters
                ? "Ajuste os filtros para ver outras parcelas."
                : "Nenhuma parcela corresponde a esta busca."
            }
          />
        )}
      </div>

      <InstallmentDetailSheet
        budget={
          detailSheet.budgetId !== null
            ? (budgetDetails[detailSheet.budgetId] ?? null)
            : null
        }
        open={detailSheet.open}
        onOpenChange={detailSheet.onOpenChange}
      />

      <ConfirmDialog
        open={payDialog.open}
        onOpenChange={payDialog.onOpenChange}
        title="Dar baixa na parcela"
        description={
          payDialog.installment
            ? `Confirmar o recebimento da ${describeInstallment(payDialog.installment)}?`
            : undefined
        }
        confirmLabel="Dar baixa"
        isLoading={payDialog.isLoading}
        onConfirm={payDialog.onConfirm}
      />

      <ConfirmDialog
        open={unpayDialog.open}
        onOpenChange={unpayDialog.onOpenChange}
        title="Desfazer baixa"
        description={
          unpayDialog.installment
            ? `A ${describeInstallment(unpayDialog.installment)} voltará a constar como não recebida. Deseja continuar?`
            : undefined
        }
        confirmLabel="Desfazer"
        variant="destructive"
        isLoading={unpayDialog.isLoading}
        onConfirm={unpayDialog.onConfirm}
      />
    </>
  );
}
