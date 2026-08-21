"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePointViewType } from "@/lib/utils/dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

interface RevenueChartProps {
  series: RevenuePointViewType[];
}

const SERIES = [
  { key: "received", label: "Recebido", color: "var(--color-chart-received)" },
  {
    key: "receivable",
    label: "A receber",
    color: "var(--color-chart-receivable)",
  },
  { key: "overdue", label: "Em atraso", color: "var(--color-chart-overdue)" },
] as const;

/** Eixo Y compacto: "R$ 12,5 mil" em vez de repetir "R$0k R$0k R$1k". */
function formatAxisCurrency(value: number): string {
  if (value === 0) return "R$ 0";
  if (Math.abs(value) >= 1000) {
    return `R$ ${(value / 1000).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    })} mil`;
  }
  return `R$ ${value.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-panel-border bg-panel-surface p-3 shadow-lg">
      <p className="mb-1.5 font-medium text-panel-surface-foreground text-xs capitalize">
        {label}
      </p>
      <ul className="flex flex-col gap-1">
        {payload.map((item) => {
          const serie = SERIES.find((entry) => entry.key === item.dataKey);

          return (
            <li
              key={item.dataKey}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="flex items-center gap-1.5 text-panel-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                {serie?.label ?? item.dataKey}
              </span>
              <span className="font-medium text-panel-surface-foreground tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * As três séries são sobrepostas, não empilhadas: `overdue` é subconjunto de
 * `receivable`, então somá-las contaria o mesmo dinheiro duas vezes.
 */
export function RevenueChart({ series }: RevenueChartProps) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={series}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            {SERIES.map((serie) => (
              <linearGradient
                key={serie.key}
                id={`fill-${serie.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={serie.color} stopOpacity={0.25} />
                <stop offset="100%" stopColor={serie.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-chart-grid)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--color-panel-muted-foreground)", fontSize: 11 }}
            minTickGap={16}
          />
          <YAxis
            tickFormatter={formatAxisCurrency}
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fill: "var(--color-panel-muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: "var(--color-chart-grid)" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span className="text-panel-muted-foreground">
                {SERIES.find((serie) => serie.key === value)?.label ?? value}
              </span>
            )}
          />

          {SERIES.map((serie) => (
            <Area
              key={serie.key}
              type="monotone"
              dataKey={serie.key}
              stroke={serie.color}
              strokeWidth={2}
              fill={`url(#fill-${serie.key})`}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
