"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, Plus, Trash2, X } from "lucide-react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { InputComponent } from "@/components/shared/input-component";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddEmployeerSheet } from "@/hooks/works-panel/order/use-add-employeer-sheet";
import { formatCurrency, unmaskCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import type { AttendanceOccurrence } from "@/lib/utils/get-attendance-occurrences";
import type { EmployeerFormRow } from "@/store/works-panel/order/new-order-store";
import { PriceComparisonIcon } from "../price-comparison-icon";

interface AddEmployeerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeers: EmployeerResponseType[];
  occurrences: AttendanceOccurrence[];
  existingRows: EmployeerFormRow[];
  onConfirm: (rows: EmployeerFormRow[]) => void;
}

export function AddEmployeerSheet({
  open,
  onOpenChange,
  employeers,
  occurrences,
  existingRows,
  onConfirm,
}: AddEmployeerSheetProps) {
  const {
    draft,
    pendingItems,
    employeerOptions,
    allDatesSelected,
    weekDayShortcuts,
    monthShortcuts,
    canAddDraft,
    reset,
    handleEmployeerChange,
    toggleDate,
    toggleAllDates,
    selectShortcut,
    isShortcutActive,
    handleDailyRateChange,
    handleAddDraftToPending,
    handleRemovePendingItem,
  } = useAddEmployeerSheet(employeers, occurrences, existingRows);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    if (pendingItems.length === 0) return;
    onConfirm(pendingItems);
    reset();
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-surface p-0 sm:max-w-xl!"
      >
        <SheetHeader className="flex-row shrink-0 items-start justify-between gap-3 space-y-0 border-b border-panel-border p-4 sm:gap-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <SheetTitle className="font-bold text-lg text-panel-surface-foreground">
              Adicionar funcionários
            </SheetTitle>
            <SheetDescription className="text-xs text-panel-muted-foreground sm:text-sm">
              Escolha o funcionário, os dias e o valor da diária.
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-panel-surface-foreground">
                Funcionário
              </span>
              <SelectCombobox
                options={employeerOptions}
                value={draft.employeerId}
                onChange={handleEmployeerChange}
                placeholder="Selecione o funcionário"
                searchPlaceholder="Buscar funcionário..."
                emptyMessage="Nenhum funcionário disponível."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-panel-surface-foreground">
                Valor da diária
              </span>
              <InputComponent.wrapper
                iconName="wallet"
                classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-surface focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
                classNameIcon="text-panel-muted-foreground"
              >
                <InputComponent.maskedCurrency
                  id="draft-employeer-daily-rate"
                  value={draft.dailyRate}
                  onChange={handleDailyRateChange}
                  placeHolder="R$ 0,00"
                  className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                />
                {draft.employeer && (
                  <PriceComparisonIcon
                    unitPrice={draft.dailyRate}
                    basePrice={draft.employeer.dailyRate}
                  />
                )}
              </InputComponent.wrapper>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-panel-surface-foreground">
                  Dias de trabalho
                </span>
                {draft.selectedDates.length > 0 && (
                  <span className="shrink-0 text-xs text-panel-muted-foreground tabular-nums">
                    {draft.selectedDates.length} de {occurrences.length}
                  </span>
                )}
              </div>

              {occurrences.length === 0 ? (
                <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground">
                  Defina o prazo da obra e os dias de atendimento antes de
                  adicionar funcionários.
                </div>
              ) : (
                <>
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <ShortcutChip
                      label="Todos"
                      count={occurrences.length}
                      active={allDatesSelected}
                      onSelect={toggleAllDates}
                    />

                    <span className="mx-0.5 h-5 w-px shrink-0 bg-panel-border" />

                    {weekDayShortcuts.map((shortcut) => (
                      <ShortcutChip
                        key={shortcut.key}
                        label={shortcut.label}
                        count={shortcut.count}
                        active={isShortcutActive(shortcut.dateKeys)}
                        onSelect={() => selectShortcut(shortcut.dateKeys)}
                      />
                    ))}

                    {monthShortcuts.length > 1 && (
                      <>
                        <span className="mx-0.5 h-5 w-px shrink-0 bg-panel-border" />

                        {monthShortcuts.map((shortcut) => (
                          <ShortcutChip
                            key={shortcut.key}
                            label={shortcut.label}
                            count={shortcut.count}
                            active={isShortcutActive(shortcut.dateKeys)}
                            onSelect={() => selectShortcut(shortcut.dateKeys)}
                          />
                        ))}
                      </>
                    )}
                  </div>

                  <div className="grid max-h-56 min-w-0 grid-cols-1 gap-1 overflow-y-auto rounded-lg border border-panel-border p-2 sm:max-h-64 sm:grid-cols-2">
                    {occurrences.map((occurrence) => {
                      const dateKey = occurrence.date
                        .toISOString()
                        .slice(0, 10);
                      const isSelected = draft.selectedDates.includes(dateKey);

                      return (
                        <button
                          key={dateKey}
                          type="button"
                          onClick={() => toggleDate(dateKey)}
                          className={cn(
                            "flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                            isSelected
                              ? "bg-panel-accent/10 text-panel-surface-foreground"
                              : "text-panel-muted-foreground hover:bg-panel-page",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded border",
                              isSelected
                                ? "border-panel-accent bg-panel-accent text-white"
                                : "border-panel-border",
                            )}
                          >
                            {isSelected && <Check className="size-3" />}
                          </span>
                          <span className="truncate">
                            {format(occurrence.date, "EEE, dd/MM", {
                              locale: ptBR,
                            })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {draft.employeer &&
              draft.dailyRate &&
              draft.selectedDates.length > 0 && (
                <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-panel-page/60 px-3 py-2.5">
                  <span className="min-w-0 truncate text-xs text-panel-muted-foreground">
                    {draft.selectedDates.length} dia(s) ×{" "}
                    {formatCurrency(unmaskCurrency(draft.dailyRate))}
                  </span>
                  <span className="shrink-0 text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums">
                    {formatCurrency(
                      unmaskCurrency(draft.dailyRate) *
                        draft.selectedDates.length,
                    )}
                  </span>
                </div>
              )}

            <Button
              type="button"
              variant="secondary"
              className="w-full cursor-pointer gap-1.5 hover:bg-panel-border"
              disabled={!canAddDraft}
              onClick={handleAddDraftToPending}
            >
              <Plus className="size-4" />
              Adicionar à lista
            </Button>
          </div>

          {pendingItems.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-panel-border pt-4">
              <span className="text-xs font-semibold tracking-widest text-panel-muted-foreground">
                Funcionários nesta sessão ({pendingItems.length})
              </span>
              <ul className="flex flex-col divide-y divide-panel-border">
                {pendingItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-panel-surface-foreground">
                        {item.employeer.name}
                      </p>
                      <p className="truncate text-xs text-panel-muted-foreground">
                        {item.selectedDates.length} dia(s) ×{" "}
                        {formatCurrency(unmaskCurrency(item.dailyRate))}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingItem(item.id)}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">
                        Remover {item.employeer.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <SheetFooter className="mt-0 shrink-0 flex-col-reverse gap-2 border-t border-panel-border p-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full cursor-pointer hover:bg-panel-border sm:w-auto"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer sm:w-auto"
            disabled={pendingItems.length === 0}
            onClick={handleConfirm}
          >
            Confirmar {pendingItems.length > 0 && `(${pendingItems.length})`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

interface ShortcutChipProps {
  label: string;
  count: number;
  active: boolean;
  onSelect: () => void;
}

function ShortcutChip({ label, count, active, onSelect }: ShortcutChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 text-xs font-medium transition-colors",
        active
          ? "border-panel-accent bg-panel-accent text-white"
          : "border-panel-border bg-panel-surface text-panel-surface-foreground hover:border-panel-accent/40 hover:bg-panel-page",
      )}
    >
      {label}
      <span
        className={cn(
          "tabular-nums",
          active ? "text-white/60" : "text-panel-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}
