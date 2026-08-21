"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import type { DashboardCustomerOptionType } from "@/@type/works-panel/dashboard/get-dashboard.type";
import { MultiSelectCombobox } from "@/components/shared/multi-select-combobox";
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
import { MonthRangePicker } from "@/components/works-panel/dashboard/month-range-picker";

interface DashboardFiltersProps {
  customers: DashboardCustomerOptionType[];
  from: string | null;
  to: string | null;
  customerIds: number[];
}

/**
 * Estado na URL, diferente do financeiro: o recorte do dashboard se compartilha
 * por link e precisa sobreviver a um refresh.
 */
export function DashboardFilters({
  customers,
  from,
  to,
  customerIds,
}: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const activeCount =
    (from !== null || to !== null ? 1 : 0) + (customerIds.length > 0 ? 1 : 0);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(next)) {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    const query = params.toString();

    startTransition(() => {
      router.replace(query ? `?${query}` : "/gestao-obras/dashboard", {
        scroll: false,
      });
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="relative h-10 shrink-0 cursor-pointer gap-1.5 border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-panel-accent font-semibold text-white text-xs">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-surface p-0 sm:max-w-md!"
      >
        <SheetHeader className="shrink-0 flex-row items-start justify-between gap-3 space-y-0 border-panel-border border-b p-4 sm:gap-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <SheetTitle className="font-bold text-panel-surface-foreground">
              Filtrar dashboard
            </SheetTitle>
            <SheetDescription className="text-panel-muted-foreground text-xs sm:text-sm">
              Recorte os indicadores por período e por cliente.
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-panel-surface-foreground text-sm">
              Período
            </span>
            <MonthRangePicker
              from={from}
              to={to}
              disabled={isPending}
              onChange={(range) =>
                updateParams({ from: range.from, to: range.to })
              }
            />
            <p className="text-panel-muted-foreground text-xs">
              Sem seleção, o dashboard considera todo o histórico.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-panel-surface-foreground text-sm">
              Clientes
            </span>
            <MultiSelectCombobox
              id="dashboard-customers"
              options={customers.map((customer) => ({
                value: String(customer.id),
                label: customer.name,
              }))}
              value={customerIds.map(String)}
              onChange={(values) =>
                updateParams({ customerIds: values.join(",") || null })
              }
              placeholder="Todos os clientes"
              searchPlaceholder="Buscar cliente..."
              emptyMessage="Nenhum cliente encontrado."
              disabled={isPending}
            />
          </div>
        </div>

        <SheetFooter className="mt-0 shrink-0 flex-col-reverse gap-2 border-panel-border border-t p-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer hover:bg-panel-border"
            disabled={isPending || activeCount === 0}
            onClick={() =>
              updateParams({ from: null, to: null, customerIds: null })
            }
          >
            Limpar filtros
          </Button>
          <Button
            type="button"
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Ver resultados
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
