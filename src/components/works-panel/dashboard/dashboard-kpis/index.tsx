import type { DashboardKpisType } from "@/@type/works-panel/dashboard/get-dashboard.type";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils/cn";
import { formatPercent } from "@/lib/utils/dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

interface DashboardKpisProps {
  kpis: DashboardKpisType;
}

type KpiTone = "neutral" | "positive" | "negative";

interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  delay: number;
  tone?: KpiTone;
}

const TONE_CLASS: Record<KpiTone, string> = {
  neutral: "text-panel-surface-foreground",
  positive: "text-status-success",
  negative: "text-status-danger",
};

function pluralize(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function KpiCard({
  label,
  value,
  hint,
  delay,
  tone = "neutral",
}: KpiCardProps) {
  return (
    <FadeIn
      direction="up"
      distance={12}
      delay={delay}
      duration={0.35}
      onMount
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-xl border bg-panel-surface p-4",
        tone === "negative" ? "border-status-danger/30" : "border-panel-border",
      )}
    >
      <span className="truncate font-medium text-panel-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </span>
      <strong
        className={cn(
          "truncate font-semibold text-xl tabular-nums sm:text-2xl",
          TONE_CLASS[tone],
        )}
      >
        {value}
      </strong>
      <span className="truncate text-panel-muted-foreground text-xs">
        {hint}
      </span>
    </FadeIn>
  );
}

export function DashboardKpis({ kpis }: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <KpiCard
        label="Orçado"
        value={formatCurrency(kpis.quotedTotal)}
        hint={pluralize(kpis.quotedCount, "orçamento", "orçamentos")}
        delay={0}
      />
      <KpiCard
        label="Aprovado"
        value={formatCurrency(kpis.approvedTotal)}
        hint={pluralize(kpis.approvedCount, "orçamento", "orçamentos")}
        delay={0.04}
        tone="positive"
      />
      <KpiCard
        label="Conversão"
        value={formatPercent(kpis.conversionRate)}
        hint={`${kpis.approvedCount} de ${kpis.quotedCount} fechados`}
        delay={0.08}
      />
      <KpiCard
        label="Recebido"
        value={formatCurrency(kpis.receivedTotal)}
        hint={pluralize(kpis.receivedCount, "parcela", "parcelas")}
        delay={0.12}
        tone="positive"
      />
      <KpiCard
        label="A receber"
        value={formatCurrency(kpis.receivableTotal)}
        hint={pluralize(kpis.receivableCount, "parcela", "parcelas")}
        delay={0.16}
      />
      <KpiCard
        label="Em atraso"
        value={formatCurrency(kpis.overdueTotal)}
        hint={pluralize(kpis.overdueCount, "parcela", "parcelas")}
        delay={0.2}
        tone={kpis.overdueCount > 0 ? "negative" : "neutral"}
      />
    </div>
  );
}
