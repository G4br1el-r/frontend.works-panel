"use client";

import { Plus, Trash2, X } from "lucide-react";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { InputComponent } from "@/components/shared/input-component";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAddMaterialSheet } from "@/hooks/works-panel/order/use-add-material-sheet";
import { formatCurrency, unmaskCurrency } from "@/lib/utils";
import type { MaterialFormRow } from "@/store/works-panel/order/new-order-store";
import { PriceComparisonIcon } from "../price-comparison-icon";

interface AddMaterialSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materials: MaterialResponseType[];
  existingRows: MaterialFormRow[];
  onConfirm: (rows: Omit<MaterialFormRow, "sourceServiceRowIds">[]) => void;
}

export function AddMaterialSheet({
  open,
  onOpenChange,
  materials,
  existingRows,
  onConfirm,
}: AddMaterialSheetProps) {
  const {
    draft,
    pendingItems,
    materialOptions,
    canAddDraft,
    reset,
    handleMaterialChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleAddDraftToPending,
    handleRemovePendingItem,
  } = useAddMaterialSheet(materials, existingRows);

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
              Adicionar materiais
            </SheetTitle>
            <SheetDescription className="text-xs text-panel-muted-foreground sm:text-sm">
              Escolha o material, defina quantidade e valor.
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
                Material
              </span>
              <SelectCombobox
                options={materialOptions}
                value={draft.materialId}
                onChange={handleMaterialChange}
                placeholder="Selecione o material"
                searchPlaceholder="Buscar material..."
                emptyMessage="Nenhum material disponível."
              />
            </div>

            {draft.material && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-panel-muted-foreground">
                {draft.material.measure && (
                  <span>Medida: {draft.material.measure.name}</span>
                )}
                <span className="ml-auto">
                  Base: {formatCurrency(Number(draft.material.basePrice))}
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-panel-surface-foreground">
                  Quantidade
                </span>
                <Input
                  type="number"
                  min={1}
                  value={draft.quantity}
                  onChange={(event) => handleQuantityChange(event.target.value)}
                  className="h-11 rounded-lg border-panel-border bg-panel-surface text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-panel-surface-foreground">
                  Valor unitário
                </span>
                <InputComponent.wrapper
                  iconName="wallet"
                  classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-surface focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
                  classNameIcon="text-panel-muted-foreground"
                >
                  <InputComponent.maskedCurrency
                    id="draft-material-unit-price"
                    value={draft.unitPrice}
                    onChange={handleUnitPriceChange}
                    placeHolder="R$ 0,00"
                    className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                  />
                  {draft.material && (
                    <PriceComparisonIcon
                      unitPrice={draft.unitPrice}
                      basePrice={Number(draft.material.basePrice)}
                    />
                  )}
                </InputComponent.wrapper>
              </div>
            </div>

            {draft.material && draft.unitPrice && (
              <div className="flex items-center justify-between gap-2 rounded-lg bg-panel-page/60 px-3 py-2.5">
                <span className="text-xs text-panel-muted-foreground">
                  Subtotal deste item
                </span>
                <span className="break-all text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums">
                  {formatCurrency(
                    unmaskCurrency(draft.unitPrice) *
                      Number(draft.quantity || 0),
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
                Materiais nesta sessão ({pendingItems.length})
              </span>
              <ul className="flex flex-col divide-y divide-panel-border">
                {pendingItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex min-w-0 items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-panel-surface-foreground">
                        {item.material.name}
                      </p>
                      <p className="flex min-w-0 flex-wrap items-center gap-x-1 text-xs text-panel-muted-foreground">
                        <span className="shrink-0">
                          {item.quantity} ×{" "}
                          {formatCurrency(unmaskCurrency(item.unitPrice))}
                        </span>
                        <PriceComparisonIcon
                          unitPrice={item.unitPrice}
                          basePrice={Number(item.material.basePrice)}
                        />
                        <span className="shrink-0 text-panel-muted-foreground/70">
                          (Base{" "}
                          {formatCurrency(Number(item.material.basePrice))})
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePendingItem(item.id)}
                      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30"
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">
                        Remover {item.material.name}
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
