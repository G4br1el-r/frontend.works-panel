import type { RankedValueType } from "@/@type/works-panel/dashboard/get-dashboard.type";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface TopRankingProps {
  items: RankedValueType[];
  /** Sufixo da contagem: "vendidos", "orçamentos"... */
  countLabel: (count: number) => string;
  emptyMessage: string;
}

/**
 * Barra proporcional em CSS puro em vez de gráfico: com 5 itens rotulados, uma
 * lista lê melhor que um bar chart — e ganha responsividade de graça.
 */
export function TopRanking({
  items,
  countLabel,
  emptyMessage,
}: TopRankingProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-panel-border border-dashed bg-panel-page/40 p-4 text-center text-panel-muted-foreground text-sm">
        {emptyMessage}
      </p>
    );
  }

  const max = Math.max(...items.map((item) => item.value));

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => {
        const ratio = max > 0 ? item.value / max : 0;

        return (
          <li key={item.id} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-baseline gap-2">
                <span
                  className={cn(
                    "shrink-0 font-semibold text-xs tabular-nums",
                    index === 0
                      ? "text-panel-accent"
                      : "text-panel-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="truncate text-panel-surface-foreground text-sm">
                  {item.label}
                </span>
              </span>
              <span className="shrink-0 whitespace-nowrap font-medium text-panel-surface-foreground text-sm tabular-nums">
                {formatCurrency(item.value)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-panel-page">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    index === 0 ? "bg-panel-accent" : "bg-panel-border",
                  )}
                  style={{ width: `${Math.max(ratio * 100, 2)}%` }}
                />
              </div>
              <span className="shrink-0 whitespace-nowrap text-panel-muted-foreground text-xs tabular-nums">
                {countLabel(item.count)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
