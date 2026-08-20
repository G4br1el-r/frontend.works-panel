"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Trash2 } from "lucide-react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { Button } from "@/components/ui/button";
import { getAttendanceOccurrences } from "@/lib/utils/get-attendance-occurrences";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { AddEmployeerSheet } from "../add-employeer-sheet";
import { PriceComparisonIcon } from "../price-comparison-icon";
import { WrapperForm } from "../wrapper-form";

interface EmployeerFormProps {
  employeers: EmployeerResponseType[];
}

export function EmployeerForm({ employeers }: EmployeerFormProps) {
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const attendanceDays = useNewOrderStore((state) => state.attendanceDays);
  const rows = useNewOrderStore((state) => state.employeerRows);
  const isSheetOpen = useNewOrderStore((state) => state.isEmployeerSheetOpen);
  const openSheet = useNewOrderStore((state) => state.openEmployeerSheet);
  const closeSheet = useNewOrderStore((state) => state.closeEmployeerSheet);
  const handleAddRows = useNewOrderStore((state) => state.addEmployeerRows);
  const handleRemoveRow = useNewOrderStore((state) => state.removeEmployeerRow);
  const getSubtotal = useNewOrderStore((state) => state.getEmployeerSubtotal);
  const totalAmount = useNewOrderStore((state) => state.employeerTotalAmount());

  const occurrences = getAttendanceOccurrences(
    startDate,
    endDate,
    attendanceDays,
  );
  const canAddEmployeer = occurrences.length > 0;

  return (
    <>
      <WrapperForm
        title="Funcionários"
        description="Escolha quem vai trabalhar e em quais dias."
        icon="user"
        action={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 cursor-pointer gap-1.5 hover:bg-panel-border"
            onClick={openSheet}
            disabled={!canAddEmployeer}
          >
            <Plus className="size-3.5" />
            Adicionar funcionário
          </Button>
        }
      >
        {!canAddEmployeer ? (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground sm:p-8">
            Defina o prazo da obra e os dias de atendimento para adicionar
            funcionários.
          </div>
        ) : rows.length === 0 ? (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground sm:p-8">
            Nenhum funcionário no orçamento. Clique em "Adicionar funcionário"
            para começar.
          </div>
        ) : (
          <div className="flex w-full min-w-0 flex-col">
            <ul className="flex w-full min-w-0 flex-col divide-y divide-panel-border">
              {rows.map((row) => (
                <li
                  key={row.id}
                  className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                >
                  <div className="flex min-w-0 items-start justify-between gap-2 sm:block">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-panel-surface-foreground">
                        {row.employeer.name}
                      </p>
                      <p className="truncate text-xs text-panel-muted-foreground">
                        {row.selectedDates.length} dia(s)
                        {row.selectedDates.length > 0 &&
                          ` · ${format(new Date(row.selectedDates[0]), "dd/MM", { locale: ptBR })}${
                            row.selectedDates.length > 1
                              ? ` até ${format(
                                  new Date(
                                    row.selectedDates[
                                      row.selectedDates.length - 1
                                    ],
                                  ),
                                  "dd/MM",
                                  { locale: ptBR },
                                )}`
                              : ""
                          }`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30 sm:hidden"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">
                        Remover {row.employeer.name}
                      </span>
                    </button>
                  </div>

                  <div className="flex min-w-0 items-center justify-between gap-2 sm:shrink-0 sm:justify-start sm:gap-4">
                    <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md bg-panel-page px-2 text-xs font-semibold text-panel-surface-foreground">
                      × {row.selectedDates.length}
                    </span>

                    <div className="flex min-w-0 flex-col items-end gap-0.5 sm:w-28 sm:shrink-0">
                      <span className="flex min-w-0 items-center gap-1 text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums">
                        <span className="flex size-4 shrink-0 items-center justify-center">
                          <PriceComparisonIcon
                            unitPrice={row.dailyRate}
                            basePrice={row.employeer.dailyRate}
                          />
                        </span>
                        <span className="truncate">{getSubtotal(row)}</span>
                      </span>
                      <span className="w-full truncate text-right text-[11px] text-panel-muted-foreground">
                        {formatDailyRate(row.dailyRate)}/dia
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(row.id)}
                      className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30 sm:flex"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">
                        Remover {row.employeer.name}
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-panel-border pt-3">
              <span className="shrink-0 text-xs text-panel-muted-foreground">
                Total geral
              </span>
              <span className="min-w-0 break-all text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums sm:text-base">
                {totalAmount}
              </span>
            </div>
          </div>
        )}
      </WrapperForm>

      <AddEmployeerSheet
        open={isSheetOpen}
        onOpenChange={(open) => (open ? openSheet() : closeSheet())}
        employeers={employeers}
        occurrences={occurrences}
        existingRows={rows}
        onConfirm={handleAddRows}
      />
    </>
  );
}

function formatDailyRate(value: string) {
  return `R$ ${value}`;
}
