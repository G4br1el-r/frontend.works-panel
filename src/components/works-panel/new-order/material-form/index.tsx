"use client";

import { Plus, Trash2 } from "lucide-react";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { InputComponent } from "@/components/shared/input-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { AddMaterialSheet } from "../add-material-sheet";
import { PriceComparisonIcon } from "../price-comparison-icon";
import { WrapperForm } from "../wrapper-form";

interface MaterialFormProps {
  materials: MaterialResponseType[];
}

export function MaterialForm({ materials }: MaterialFormProps) {
  const rows = useNewOrderStore((state) => state.materialRows);
  const isSheetOpen = useNewOrderStore((state) => state.isMaterialSheetOpen);
  const openSheet = useNewOrderStore((state) => state.openMaterialSheet);
  const closeSheet = useNewOrderStore((state) => state.closeMaterialSheet);
  const handleAddRows = useNewOrderStore((state) => state.addMaterialRows);
  const handleRemoveRow = useNewOrderStore((state) => state.removeMaterialRow);
  const handleUpdateRow = useNewOrderStore((state) => state.updateMaterialRow);
  const getSubtotal = useNewOrderStore((state) => state.getMaterialSubtotal);
  const totalAmount = useNewOrderStore((state) => state.materialTotalAmount());

  return (
    <>
      <WrapperForm
        title="Materiais"
        description="Adicione e gerencie os materiais deste orçamento."
        icon="package"
        action={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-8 cursor-pointer gap-1.5 hover:bg-panel-border"
            onClick={openSheet}
          >
            <Plus className="size-3.5" />
            Adicionar material
          </Button>
        }
      >
        {rows.length === 0 ? (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground sm:p-8">
            Nenhum material no orçamento. Clique em "Adicionar material" para
            começar.
          </div>
        ) : (
          <div className="flex w-full min-w-0 flex-col">
            <ul className="flex w-full min-w-0 flex-col divide-y divide-panel-border">
              {rows.map((row) => {
                const isAutomatic = row.sourceServiceRowIds.length > 0;

                return (
                  <li
                    key={row.id}
                    className="flex min-w-0 flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2 sm:block">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-panel-surface-foreground">
                          {row.material.name}
                        </p>
                        <p className="truncate text-xs text-panel-muted-foreground">
                          {row.material.measure
                            ? row.material.measure.name
                            : "Sem medida"}
                          {isAutomatic && " · Adicionado automaticamente"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30 sm:hidden"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">
                          Remover {row.material.name}
                        </span>
                      </button>
                    </div>

                    <div className="flex min-w-0 items-center gap-2 sm:shrink-0 sm:gap-3">
                      <Input
                        type="number"
                        min={1}
                        value={row.quantity}
                        onChange={(event) =>
                          handleUpdateRow(row.id, {
                            quantity: event.target.value,
                          })
                        }
                        className="h-9 w-14 shrink-0 rounded-md border-panel-border bg-panel-surface px-1 text-center text-base sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />

                      <div className="min-w-0 flex-1 sm:w-40 sm:flex-none">
                        <InputComponent.wrapper
                          iconName="wallet"
                          classNameWrapper="h-9 rounded-md border border-panel-border bg-panel-surface focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
                          classNameIcon="text-panel-muted-foreground"
                        >
                          <InputComponent.maskedCurrency
                            id={`material-unit-price-${row.id}`}
                            value={row.unitPrice}
                            onChange={(value) =>
                              handleUpdateRow(row.id, { unitPrice: value })
                            }
                            placeHolder="R$ 0,00"
                            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                          />
                          <PriceComparisonIcon
                            unitPrice={row.unitPrice}
                            basePrice={Number(row.material.basePrice)}
                          />
                        </InputComponent.wrapper>
                      </div>

                      <div className="flex w-24 shrink-0 flex-col items-end gap-0.5 sm:w-32">
                        <span className="w-full truncate text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums">
                          {getSubtotal(row)}
                        </span>
                        <span className="w-full truncate text-right text-[11px] text-panel-muted-foreground">
                          Base {formatCurrency(Number(row.material.basePrice))}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="hidden size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30 sm:flex"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">
                          Remover {row.material.name}
                        </span>
                      </button>
                    </div>
                  </li>
                );
              })}
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

      <AddMaterialSheet
        open={isSheetOpen}
        onOpenChange={(open) => (open ? openSheet() : closeSheet())}
        materials={materials}
        existingRows={rows}
        onConfirm={handleAddRows}
      />
    </>
  );
}
