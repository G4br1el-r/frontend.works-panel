import type { ScheduleOccupationType } from "@/@type/works-panel/dashboard/get-dashboard.type";
import { formatPercent } from "@/lib/utils/dashboard";

interface OccupationCardProps {
  occupation: ScheduleOccupationType;
}

export function OccupationCard({ occupation }: OccupationCardProps) {
  const percent = Math.min(Math.max(occupation.rate, 0), 1) * 100;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5">
          <strong className="font-bold text-3xl text-panel-surface-foreground tabular-nums">
            {occupation.busyDays}
          </strong>
          <span className="text-panel-muted-foreground text-sm tabular-nums">
            / {occupation.totalDays} dias
          </span>
        </div>
        <span className="font-semibold text-panel-accent text-lg tabular-nums">
          {formatPercent(occupation.rate)}
        </span>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-panel-page">
        <div
          className="h-full rounded-full bg-panel-accent transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
        <span className="flex items-center gap-1.5 text-panel-muted-foreground">
          <span className="size-2 rounded-full bg-panel-accent" />
          {occupation.busyDays} com obra agendada
        </span>
        <span className="flex items-center gap-1.5 text-panel-muted-foreground">
          <span className="size-2 rounded-full bg-panel-border" />
          {occupation.freeDays} livres
        </span>
      </div>
    </div>
  );
}
