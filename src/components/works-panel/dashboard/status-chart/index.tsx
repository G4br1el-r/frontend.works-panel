"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";
import type { StatusSliceViewType } from "@/lib/utils/dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

interface StatusChartProps {
  slices: StatusSliceViewType[];
}

/** Mesma leitura de cor dos badges de situação usados no resto do painel. */
const STATUS_COLOR: Record<BudgetStatus, string> = {
  DRAFT: "var(--color-panel-muted-foreground)",
  SENT: "var(--color-status-warning)",
  APPROVED: "var(--color-status-success)",
  REJECTED: "var(--color-status-danger)",
  CANCELED: "var(--color-chart-overdue)",
};

interface TooltipPayloadItem {
  payload: StatusSliceViewType;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  const slice = payload?.[0]?.payload;
  if (!active || !slice) return null;

  return (
    <div className="rounded-lg border border-panel-border bg-panel-surface p-3 shadow-lg">
      <p className="font-medium text-panel-surface-foreground text-xs">
        {slice.label}
      </p>
      <p className="mt-1 text-panel-muted-foreground text-xs tabular-nums">
        {slice.count} {slice.count === 1 ? "orçamento" : "orçamentos"} ·{" "}
        {formatCurrency(slice.total)}
      </p>
    </div>
  );
}

export function StatusChart({ slices }: StatusChartProps) {
  const totalCount = slices.reduce((sum, slice) => sum + slice.count, 0);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="relative mx-auto h-48 w-full max-w-[14rem] sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="count"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.status} fill={STATUS_COLOR[slice.status]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Total no centro: o buraco do donut é o melhor espaço da peça. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <strong className="font-bold text-2xl text-panel-surface-foreground tabular-nums">
            {totalCount}
          </strong>
          <span className="text-panel-muted-foreground text-xs">
            {totalCount === 1 ? "orçamento" : "orçamentos"}
          </span>
        </div>
      </div>

      <ul className="flex min-w-0 flex-col gap-2">
        {slices.map((slice) => (
          <li
            key={slice.status}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[slice.status] }}
              />
              <span className="truncate text-panel-surface-foreground">
                {slice.label}
              </span>
            </span>
            <span className="flex shrink-0 items-baseline gap-2 tabular-nums">
              <span className="font-medium text-panel-surface-foreground text-sm">
                {slice.count}
              </span>
              <span className="whitespace-nowrap text-panel-muted-foreground text-xs">
                {formatCurrency(slice.total)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
