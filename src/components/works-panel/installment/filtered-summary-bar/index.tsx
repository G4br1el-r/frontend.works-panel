"use client";

import { ListFilter } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface FilteredSummaryBarProps {
  totals: {
    total: number;
    paid: number;
    paidCount: number;
    open: number;
    openCount: number;
    overdue: number;
    overdueCount: number;
    canceled: number;
    canceledCount: number;
    count: number;
  };
  isFiltered: boolean;
}

function Metric({
  label,
  value,
  count,
  className,
}: {
  label: string;
  value: number;
  count?: number;
  className?: string;
}) {
  return (
    <div className="flex min-w-0 items-baseline gap-1.5">
      <span className="whitespace-nowrap text-panel-muted-foreground text-xs">
        {label}
      </span>
      <span
        className={cn(
          "whitespace-nowrap font-semibold text-sm tabular-nums",
          className ?? "text-panel-surface-foreground",
        )}
      >
        {formatCurrency(value)}
      </span>
      {count !== undefined && count > 0 && (
        <span className="whitespace-nowrap text-panel-muted-foreground text-xs tabular-nums">
          ({count})
        </span>
      )}
    </div>
  );
}

/**
 * Resumo do recorte visível na tabela. Propositalmente discreto — os cards do
 * topo carregam os KPIs gerais, e esta barra é apenas o subtotal do filtro.
 */
export function FilteredSummaryBar({
  totals,
  isFiltered,
}: FilteredSummaryBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-panel-border border-dashed bg-panel-page/50 px-4 py-2.5">
      <span className="flex shrink-0 items-center gap-1.5 font-medium text-panel-muted-foreground text-xs uppercase tracking-wide">
        <ListFilter className="size-3.5" />
        {isFiltered ? "Filtro atual" : "Todas as parcelas"}
        <span className="tabular-nums">· {totals.count}</span>
      </span>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Metric label="Total" value={totals.total} />
        <Metric
          label="Em aberto"
          value={totals.open}
          count={totals.openCount}
        />
        {totals.overdueCount > 0 && (
          <Metric
            label="Atrasado"
            value={totals.overdue}
            count={totals.overdueCount}
            className="text-status-danger"
          />
        )}
        <Metric
          label="Recebido"
          value={totals.paid}
          count={totals.paidCount}
          className="text-status-success"
        />
        {totals.canceledCount > 0 && (
          <Metric
            label="Cancelado"
            value={totals.canceled}
            count={totals.canceledCount}
            className="text-panel-muted-foreground line-through"
          />
        )}
      </div>
    </div>
  );
}
