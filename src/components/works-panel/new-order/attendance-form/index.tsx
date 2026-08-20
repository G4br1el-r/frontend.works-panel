"use client";

import { Clock, Trash2 } from "lucide-react";
import { useBudgetFieldErrors } from "@/hooks/works-panel/order/use-budget-field-errors";
import { cn } from "@/lib/utils/cn";
import { countWeekDaysInPeriod } from "@/lib/utils/get-attendance-occurrences";
import {
  useNewOrderStore,
  WEEK_DAYS,
  type WeekDay,
} from "@/store/works-panel/order/new-order-store";
import { WrapperForm } from "../wrapper-form";

const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  SUN: "Dom",
  MON: "Seg",
  TUE: "Ter",
  WED: "Qua",
  THU: "Qui",
  FRI: "Sex",
  SAT: "Sáb",
};

const WEEKDAY_GROUP: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI"];
const WEEKEND_GROUP: WeekDay[] = ["SAT", "SUN"];

export function AttendanceForm() {
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const attendanceDays = useNewOrderStore((state) => state.attendanceDays);
  const toggleAttendanceDay = useNewOrderStore(
    (state) => state.toggleAttendanceDay,
  );
  const selectAttendanceDayGroup = useNewOrderStore(
    (state) => state.selectAttendanceDayGroup,
  );
  const clearAttendanceDays = useNewOrderStore(
    (state) => state.clearAttendanceDays,
  );
  const setAttendanceTime = useNewOrderStore(
    (state) => state.setAttendanceTime,
  );

  const fieldErrors = useBudgetFieldErrors();

  const hasSchedule = Boolean(startDate && endDate);
  const weekDayCounts = countWeekDaysInPeriod(startDate, endDate);

  // Só oferece os dias da semana que realmente acontecem no período da obra.
  const availableDays = WEEK_DAYS.filter((day) => weekDayCounts[day] > 0);
  const selectedDays = availableDays.filter(
    (day) => attendanceDays[day].selected,
  );

  const availableWeekdays = availableDays.filter((day) =>
    WEEKDAY_GROUP.includes(day),
  );
  const availableWeekendDays = availableDays.filter((day) =>
    WEEKEND_GROUP.includes(day),
  );

  return (
    <WrapperForm
      title="Dias e horário de atendimento"
      description="Selecione os dias da semana e o horário de cada um."
      icon="clock"
      action={
        <button
          type="button"
          onClick={clearAttendanceDays}
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Limpar dias e horários</span>
        </button>
      }
    >
      <div className="flex w-full min-w-0 flex-col gap-4">
        {!hasSchedule ? (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground sm:p-8">
            Defina o prazo da obra para escolher os dias de atendimento.
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:items-center">
              {availableDays.map((day) => {
                const isSelected = attendanceDays[day].selected;
                const occurrences = weekDayCounts[day];

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleAttendanceDay(day)}
                    className={cn(
                      "flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 text-center text-sm font-medium transition-colors sm:w-20 sm:px-3",
                      isSelected
                        ? "border-panel-accent bg-panel-accent text-white"
                        : fieldErrors.attendanceDays
                          ? "animate-shake border-destructive bg-panel-page/60 text-panel-surface-foreground"
                          : "border-panel-border bg-panel-page/60 text-panel-surface-foreground hover:border-panel-accent/40",
                    )}
                  >
                    {WEEK_DAY_LABELS[day]}
                    <span
                      className={cn(
                        "text-[11px] tabular-nums",
                        isSelected
                          ? "text-white/70"
                          : "text-panel-muted-foreground",
                      )}
                    >
                      {occurrences}
                    </span>
                  </button>
                );
              })}
            </div>

            {(availableWeekdays.length > 0 ||
              availableWeekendDays.length > 0) && (
              <>
                <span className="mx-1 hidden h-6 w-px shrink-0 bg-panel-border sm:block" />

                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <button
                    type="button"
                    onClick={() => selectAttendanceDayGroup(availableDays)}
                    className="h-9 w-full shrink-0 cursor-pointer rounded-lg border border-panel-border bg-panel-page/60 px-2 text-center text-sm font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent/40 sm:w-20"
                  >
                    Todos
                  </button>
                  {availableWeekdays.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        selectAttendanceDayGroup(availableWeekdays)
                      }
                      className="h-9 w-full shrink-0 cursor-pointer rounded-lg border border-panel-border bg-panel-page/60 px-2 text-center text-sm font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent/40 sm:w-20"
                    >
                      Semana
                    </button>
                  )}
                  {availableWeekendDays.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        selectAttendanceDayGroup(availableWeekendDays)
                      }
                      className="col-span-3 h-9 w-full shrink-0 cursor-pointer whitespace-nowrap rounded-lg border border-panel-border bg-panel-page/60 px-2 text-center text-sm font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent/40 sm:col-span-1 sm:w-32"
                    >
                      Fim de semana
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {selectedDays.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selectedDays.map((day) => (
              <div
                key={day}
                className="flex min-w-0 items-center gap-2 rounded-lg border border-panel-border bg-panel-page/60 px-3 py-2"
              >
                <span className="w-8 shrink-0 text-sm font-semibold text-panel-surface-foreground">
                  {WEEK_DAY_LABELS[day]}
                </span>
                <Clock className="hidden size-4 shrink-0 text-panel-muted-foreground sm:block" />
                <input
                  type="time"
                  value={attendanceDays[day].startTime}
                  onChange={(event) =>
                    setAttendanceTime(day, "startTime", event.target.value)
                  }
                  className="h-9 min-w-0 flex-1 rounded-md border border-panel-border bg-panel-surface px-2 text-base sm:text-sm text-panel-surface-foreground outline-none focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20 sm:w-24 sm:flex-none sm:shrink-0"
                />
                <span className="shrink-0 text-xs text-panel-muted-foreground">
                  até
                </span>
                <input
                  type="time"
                  value={attendanceDays[day].endTime}
                  onChange={(event) =>
                    setAttendanceTime(day, "endTime", event.target.value)
                  }
                  className="h-9 min-w-0 flex-1 rounded-md border border-panel-border bg-panel-surface px-2 text-base sm:text-sm text-panel-surface-foreground outline-none focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20 sm:w-24 sm:flex-none sm:shrink-0"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </WrapperForm>
  );
}
