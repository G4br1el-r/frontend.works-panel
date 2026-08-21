"use client";

import { Ban, CalendarDays, Clock, X } from "lucide-react";
import type {
  EmployeerScheduleResponseType,
  EmployeerScheduleWorkType,
} from "@/@type/works-panel/employeer/get-employeer-schedule.type";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import {
  formatScheduleDate,
  formatWorkPeriod,
  isWorkCanceled,
} from "@/lib/utils/employeer-schedule";
import { formatCurrency } from "@/lib/utils/format-currency";

interface EmployeerScheduleSheetProps {
  schedule: EmployeerScheduleResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function TotalItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="truncate text-panel-muted-foreground text-xs">
        {label}
      </span>
      <span className="truncate font-semibold text-panel-surface-foreground text-sm tabular-nums">
        {value}
      </span>
    </div>
  );
}

function WorkCard({ work }: { work: EmployeerScheduleWorkType }) {
  const canceled = isWorkCanceled(work);

  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-panel-surface p-4",
        canceled ? "border-status-danger/30 opacity-75" : "border-panel-border",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span
            className={cn(
              "truncate font-medium text-sm",
              canceled
                ? "text-panel-muted-foreground line-through"
                : "text-panel-surface-foreground",
            )}
          >
            {work.customerName}
          </span>
          <span className="flex flex-wrap items-center gap-1.5 text-panel-muted-foreground text-xs">
            <span className="tabular-nums">#{work.budgetId}</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">
              {formatWorkPeriod(work.startDate, work.endDate)}
            </span>
          </span>
        </div>

        {canceled && (
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-status-danger/30 bg-status-danger-bg px-2 py-0.5 font-medium text-[10px] text-status-danger uppercase tracking-wide">
            <Ban className="size-2.5" />
            Cancelada
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-panel-border border-t pt-3 text-xs">
        <span className="text-panel-muted-foreground tabular-nums">
          {work.daysCount} {work.daysCount === 1 ? "dia" : "dias"} ×{" "}
          {formatCurrency(work.dailyRate)}
        </span>
        <span
          className={cn(
            "font-semibold text-sm tabular-nums",
            canceled
              ? "text-panel-muted-foreground line-through"
              : "text-panel-surface-foreground",
          )}
        >
          {formatCurrency(work.total)}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5">
        {work.days.map((day) => (
          <li
            key={day.date}
            className="flex items-center justify-between gap-3 rounded-lg bg-panel-page/50 px-2.5 py-1.5 text-xs"
          >
            <span className="text-panel-surface-foreground tabular-nums">
              {formatScheduleDate(day.date)}
            </span>
            {day.startTime && day.endTime ? (
              <span className="flex items-center gap-1 whitespace-nowrap text-panel-muted-foreground tabular-nums">
                <Clock className="size-3" />
                {day.startTime} às {day.endTime}
              </span>
            ) : (
              <span className="whitespace-nowrap text-panel-muted-foreground italic">
                sem horário definido
              </span>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function EmployeerScheduleSheet({
  schedule,
  open,
  onOpenChange,
}: EmployeerScheduleSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-page p-0 sm:max-w-lg!"
      >
        <SheetHeader className="shrink-0 flex-row items-start justify-between gap-3 space-y-0 border-panel-border border-b bg-panel-surface p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1">
            <SheetTitle className="truncate font-bold text-lg text-panel-surface-foreground">
              {schedule?.employeer.name ?? "Agenda"}
            </SheetTitle>
            <SheetDescription className="text-panel-muted-foreground text-xs sm:text-sm">
              Obras e dias em que este funcionário está alocado.
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-md p-1 text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        {schedule && (
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6">
            <section className="grid grid-cols-2 gap-4 rounded-xl border border-panel-border bg-panel-surface p-4 sm:grid-cols-4">
              <TotalItem
                label="Diária atual"
                value={formatCurrency(schedule.employeer.dailyRate)}
              />
              <TotalItem
                label="Obras"
                value={String(schedule.totals.worksCount)}
              />
              <TotalItem
                label="Dias"
                value={String(schedule.totals.daysCount)}
              />
              <TotalItem
                label="Total"
                value={formatCurrency(schedule.totals.totalEarnings)}
              />
            </section>

            {schedule.works.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-panel-border border-dashed bg-panel-surface px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-panel-accent-light text-panel-accent">
                  <CalendarDays className="size-6" />
                </span>
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-panel-surface-foreground text-sm">
                    Nenhuma obra agendada
                  </p>
                  <p className="text-panel-muted-foreground text-sm">
                    Este funcionário ainda não foi alocado em nenhuma obra.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {schedule.works.map((work) => (
                  <WorkCard key={work.budgetId} work={work} />
                ))}
              </ul>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
