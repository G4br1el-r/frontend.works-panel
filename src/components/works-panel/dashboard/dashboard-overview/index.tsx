import {
  CalendarCheck,
  FileCheck2,
  TrendingDown,
  Users,
  Wallet,
} from "lucide-react";
import type { ComponentType } from "react";
import type { DashboardOverviewType } from "@/@type/works-panel/dashboard/get-dashboard.type";
import { FadeIn } from "@/components/motion/fade-in";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface DashboardOverviewProps {
  overview: DashboardOverviewType;
}

interface OverviewItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  isNegative?: boolean;
}

function OverviewItem({
  icon: Icon,
  label,
  value,
  isNegative = false,
}: OverviewItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isNegative
            ? "bg-status-danger-bg text-status-danger"
            : "bg-panel-page text-panel-muted-foreground",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-panel-muted-foreground text-xs">
          {label}
        </span>
        <span
          className={cn(
            "truncate font-semibold text-sm tabular-nums",
            isNegative ? "text-status-danger" : "text-panel-surface-foreground",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * Retrato geral do negócio. Ignora os filtros de propósito — o rótulo deixa
 * isso explícito, senão parece bug quando o usuário filtra e o bloco não muda.
 */
export function DashboardOverview({ overview }: DashboardOverviewProps) {
  return (
    <FadeIn
      direction="up"
      distance={12}
      duration={0.35}
      onMount
      className="flex flex-col gap-3 rounded-xl border border-panel-border bg-panel-surface p-4"
    >
      <TooltipComponent
        content="Estes números refletem todo o negócio e não mudam com os filtros"
        disableHoverableContent
      >
        <span className="flex w-fit cursor-default items-center gap-1.5 font-medium text-[11px] text-panel-muted-foreground uppercase tracking-wider">
          Visão geral do negócio
          <span className="rounded-full bg-panel-page px-1.5 py-0.5 text-[10px] normal-case tracking-normal">
            não filtrado
          </span>
        </span>
      </TooltipComponent>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <OverviewItem
          icon={FileCheck2}
          label="Orçamentos ativos"
          value={String(overview.activeBudgets)}
        />
        <OverviewItem
          icon={Users}
          label="Clientes"
          value={String(overview.customersCount)}
        />
        <OverviewItem
          icon={Wallet}
          label="A receber"
          value={formatCurrency(overview.openReceivable)}
        />
        <OverviewItem
          icon={TrendingDown}
          label="Em atraso"
          value={formatCurrency(overview.overdueTotal)}
          isNegative={overview.overdueTotal > 0}
        />
        <OverviewItem
          icon={CalendarCheck}
          label="Dias agendados"
          value={String(overview.scheduledDays)}
        />
      </div>
    </FadeIn>
  );
}
