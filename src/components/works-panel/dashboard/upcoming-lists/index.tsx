import { Clock, Users } from "lucide-react";
import type {
  UpcomingInstallmentType,
  UpcomingWorkType,
} from "@/@type/works-panel/dashboard/get-dashboard.type";
import { cn } from "@/lib/utils/cn";
import { formatApiDate } from "@/lib/utils/dashboard";
import { formatCurrency } from "@/lib/utils/format-currency";

function EmptyLine({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-panel-border border-dashed bg-panel-page/40 p-4 text-center text-panel-muted-foreground text-sm">
      {message}
    </p>
  );
}

export function UpcomingInstallments({
  installments,
}: {
  installments: UpcomingInstallmentType[];
}) {
  if (installments.length === 0) {
    return <EmptyLine message="Nenhuma parcela a vencer." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {installments.map((installment) => (
        <li
          key={installment.id}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border p-3",
            installment.isOverdue
              ? "border-status-danger/30 bg-status-danger-bg/30"
              : "border-panel-border bg-panel-surface",
          )}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-medium text-panel-surface-foreground text-sm">
              {installment.customerName}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 text-panel-muted-foreground text-xs">
              <span className="tabular-nums">
                {formatApiDate(installment.dueDate)}
              </span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">#{installment.budgetId}</span>
              {installment.isOverdue && (
                <span className="whitespace-nowrap rounded-full bg-status-danger-bg px-1.5 py-0.5 font-medium text-[10px] text-status-danger uppercase tracking-wide">
                  Atrasado
                </span>
              )}
            </span>
          </div>
          <span
            className={cn(
              "shrink-0 whitespace-nowrap font-semibold text-sm tabular-nums",
              installment.isOverdue
                ? "text-status-danger"
                : "text-panel-surface-foreground",
            )}
          >
            {formatCurrency(installment.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function UpcomingWorks({ works }: { works: UpcomingWorkType[] }) {
  if (works.length === 0) {
    return <EmptyLine message="Nenhuma obra agendada." />;
  }

  return (
    <ul className="flex flex-col gap-2">
      {works.map((work) => (
        <li
          key={`${work.budgetId}-${work.date}`}
          className="flex items-center justify-between gap-3 rounded-lg border border-panel-border bg-panel-surface p-3"
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-medium text-panel-surface-foreground text-sm">
              {work.customerName}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 text-panel-muted-foreground text-xs">
              <span className="tabular-nums">{formatApiDate(work.date)}</span>
              {work.startTime && work.endTime && (
                <>
                  <span aria-hidden>·</span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <Clock className="size-3" />
                    {work.startTime} às {work.endTime}
                  </span>
                </>
              )}
            </span>
          </div>
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-panel-muted-foreground text-xs tabular-nums">
            <Users className="size-3" />
            {work.teamSize}
          </span>
        </li>
      ))}
    </ul>
  );
}
