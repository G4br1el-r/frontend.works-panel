"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";
import type { OrderStatus } from "@/@type/works-panel/order/get-order.type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { BudgetRowOrigin } from "@/lib/order/budget-row";
import {
  BUDGET_STATUS_LABEL,
  ORDER_STATUS_LABEL,
} from "@/lib/order/format-budget";
import { cn } from "@/lib/utils/cn";

const ORIGIN_OPTIONS: { value: BudgetRowOrigin; label: string }[] = [
  { value: "PAINEL", label: "Do painel" },
  { value: "SITE", label: "Do site" },
];

const BUDGET_STATUS_OPTIONS: BudgetStatus[] = [
  "DRAFT",
  "SENT",
  "APPROVED",
  "REJECTED",
];

const ORDER_STATUS_OPTIONS: OrderStatus[] = ["PENDING", "ACCEPTED", "CANCELED"];

interface BudgetsFilterSheetProps {
  selectedOrigins: BudgetRowOrigin[];
  selectedStatus: string[];
  activeCount: number;
  onToggleOrigin: (origin: BudgetRowOrigin) => void;
  onToggleStatus: (status: string) => void;
  onClear: () => void;
}

export function BudgetsFilterSheet({
  selectedOrigins,
  selectedStatus,
  activeCount,
  onToggleOrigin,
  onToggleStatus,
  onClear,
}: BudgetsFilterSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="relative h-10 shrink-0 cursor-pointer gap-1.5 border-panel-border bg-panel-page/60 text-panel-surface-foreground hover:bg-panel-border"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-panel-accent text-xs font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-surface p-0 sm:max-w-md!"
      >
        <SheetHeader className="flex-row shrink-0 items-start justify-between gap-3 space-y-0 border-b border-panel-border p-4 sm:gap-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <SheetTitle className="font-bold text-panel-surface-foreground">
              Filtrar orçamentos
            </SheetTitle>
            <SheetDescription className="text-xs text-panel-muted-foreground sm:text-sm">
              Refine a lista pela origem e pela situação.
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Origem
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ORIGIN_OPTIONS.map((option) => (
                <FilterChip
                  key={option.value}
                  label={option.label}
                  active={selectedOrigins.includes(option.value)}
                  onSelect={() => onToggleOrigin(option.value)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Situação do painel
            </span>
            <div className="grid grid-cols-2 gap-2">
              {BUDGET_STATUS_OPTIONS.map((status) => (
                <FilterChip
                  key={status}
                  label={BUDGET_STATUS_LABEL[status]}
                  active={selectedStatus.includes(status)}
                  onSelect={() => onToggleStatus(status)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Situação do site
            </span>
            <div className="grid grid-cols-2 gap-2">
              {ORDER_STATUS_OPTIONS.map((status) => (
                <FilterChip
                  key={status}
                  label={ORDER_STATUS_LABEL[status]}
                  active={selectedStatus.includes(status)}
                  onSelect={() => onToggleStatus(status)}
                />
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-0 shrink-0 flex-col-reverse gap-2 border-t border-panel-border p-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full cursor-pointer hover:bg-panel-border sm:w-auto"
            onClick={onClear}
          >
            Limpar
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer sm:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Ver resultados
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function FilterChip({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "cursor-pointer rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors",
        active
          ? "border-panel-accent bg-panel-accent text-white"
          : "border-panel-border bg-panel-page/60 text-panel-muted-foreground hover:border-panel-accent/40 hover:text-panel-surface-foreground",
      )}
    >
      {label}
    </button>
  );
}
