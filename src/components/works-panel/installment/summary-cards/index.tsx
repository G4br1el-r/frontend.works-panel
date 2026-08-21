import type { InstallmentSummaryType } from "@/@type/works-panel/installment/get-installment.type";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface SummaryCardsProps {
  summary: InstallmentSummaryType;
}

interface SummaryCardProps {
  label: string;
  total: number;
  count: number;
  delay: number;
  isNegative?: boolean;
}

function pluralizeInstallments(count: number) {
  return count === 1 ? "1 parcela" : `${count} parcelas`;
}

function SummaryCard({
  label,
  total,
  count,
  delay,
  isNegative = false,
}: SummaryCardProps) {
  return (
    <FadeIn
      direction="up"
      distance={12}
      delay={delay}
      duration={0.35}
      onMount
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-lg border bg-panel-surface p-4",
        isNegative && count > 0
          ? "border-status-danger/30"
          : "border-panel-border",
      )}
    >
      <span className="truncate font-medium text-panel-muted-foreground text-xs uppercase tracking-wide">
        {label}
      </span>
      <strong
        className={cn(
          "truncate font-semibold text-xl sm:text-2xl",
          isNegative && count > 0
            ? "text-status-danger"
            : "text-panel-surface-foreground",
        )}
      >
        {formatCurrency(total)}
      </strong>
      <span className="text-panel-muted-foreground text-xs">
        {pluralizeInstallments(count)}
      </span>
    </FadeIn>
  );
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="font-medium text-[11px] text-panel-muted-foreground uppercase tracking-wider">
        Visão geral
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="A receber na semana"
          total={summary.weekToReceive.total}
          count={summary.weekToReceive.count}
          delay={0}
        />
        <SummaryCard
          label="Recebido na semana"
          total={summary.weekReceived.total}
          count={summary.weekReceived.count}
          delay={0.05}
        />
        <SummaryCard
          label="A receber no mês"
          total={summary.monthToReceive.total}
          count={summary.monthToReceive.count}
          delay={0.1}
        />
        <SummaryCard
          label="Em atraso"
          total={summary.overdue.total}
          count={summary.overdue.count}
          delay={0.15}
          isNegative
        />
      </div>
    </section>
  );
}
