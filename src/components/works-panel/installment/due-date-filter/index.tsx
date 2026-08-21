"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";

/** Filtro por dia exato ou pelo mês inteiro. `null` = sem filtro. */
export type DueDateFilterValue =
  | { mode: "day"; date: string }
  | { mode: "month"; date: string }
  | null;

interface DueDateFilterProps {
  value: DueDateFilterValue;
  onChange: (value: DueDateFilterValue) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

function formatLabel(value: DueDateFilterValue) {
  if (!value) return null;

  const date = new Date(`${value.date}T00:00:00`);

  return value.mode === "day"
    ? format(date, "dd/MM/yyyy")
    : format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

export function DueDateFilter({ value, onChange }: DueDateFilterProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"day" | "month">(value?.mode ?? "day");
  const [year, setYear] = useState(() =>
    value
      ? new Date(`${value.date}T00:00:00`).getFullYear()
      : new Date().getFullYear(),
  );

  const label = formatLabel(value);
  const selectedDate =
    value?.mode === "day" ? new Date(`${value.date}T00:00:00`) : undefined;
  const selectedMonth =
    value?.mode === "month" ? new Date(`${value.date}T00:00:00`) : null;

  function handleSelectDay(date: Date | undefined) {
    if (!date) return;
    onChange({ mode: "day", date: format(date, "yyyy-MM-dd") });
    setOpen(false);
  }

  function handleSelectMonth(monthIndex: number) {
    onChange({
      mode: "month",
      date: format(new Date(year, monthIndex, 1), "yyyy-MM-dd"),
    });
    setOpen(false);
  }

  function handleClear() {
    onChange(null);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative w-full">
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-panel-border bg-panel-surface px-3 text-left text-base outline-none transition-all focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20 sm:text-sm",
              label && "pr-9",
            )}
          >
            <CalendarIcon className="size-4 shrink-0 text-panel-muted-foreground" />
            <span
              className={cn(
                "truncate capitalize",
                label
                  ? "text-panel-surface-foreground"
                  : "text-panel-muted-foreground",
              )}
            >
              {label ?? "Vencimento"}
            </span>
          </button>
        </PopoverTrigger>

        {label && (
          <button
            type="button"
            aria-label="Limpar filtro de vencimento"
            className="-translate-y-1/2 absolute top-1/2 right-2 cursor-pointer rounded-xs p-1 text-panel-muted-foreground transition-colors hover:text-panel-surface-foreground"
            onClick={handleClear}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      <PopoverContent
        align="start"
        className="w-fit max-w-[calc(100vw-1.5rem)] overflow-x-auto rounded-lg border border-panel-border bg-panel-surface p-0"
      >
        <div className="flex items-center gap-1 border-b border-panel-border p-2">
          {(["day", "month"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTab(option)}
              className={cn(
                "flex-1 cursor-pointer rounded-md px-3 py-1.5 font-medium text-xs transition-colors",
                tab === option
                  ? "bg-panel-accent text-white"
                  : "text-panel-muted-foreground hover:bg-panel-page",
              )}
            >
              {option === "day" ? "Por dia" : "Por mês"}
            </button>
          ))}
        </div>

        {tab === "day" ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectDay}
            locale={ptBR}
            className="bg-panel-surface text-panel-surface-foreground"
          />
        ) : (
          <div className="flex w-[min(17rem,calc(100vw-2.5rem))] flex-col gap-2 p-3">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-panel-muted-foreground hover:bg-panel-page"
                onClick={() => setYear((current) => current - 1)}
              >
                <span aria-hidden>‹</span>
                <span className="sr-only">Ano anterior</span>
              </Button>
              <span className="font-medium text-panel-surface-foreground text-sm">
                {year}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-panel-muted-foreground hover:bg-panel-page"
                onClick={() => setYear((current) => current + 1)}
              >
                <span aria-hidden>›</span>
                <span className="sr-only">Próximo ano</span>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((monthIndex) => {
                const isSelected =
                  selectedMonth?.getFullYear() === year &&
                  selectedMonth?.getMonth() === monthIndex;

                return (
                  <button
                    key={monthIndex}
                    type="button"
                    onClick={() => handleSelectMonth(monthIndex)}
                    className={cn(
                      "cursor-pointer rounded-md px-2 py-1.5 text-xs capitalize transition-colors",
                      isSelected
                        ? "bg-panel-accent font-medium text-white"
                        : "text-panel-surface-foreground hover:bg-panel-page",
                    )}
                  >
                    {format(new Date(year, monthIndex, 1), "MMM", {
                      locale: ptBR,
                    })}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {value && (
          <div className="border-t border-panel-border p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full cursor-pointer text-panel-muted-foreground hover:bg-panel-page hover:text-panel-surface-foreground!"
              onClick={handleClear}
            >
              Limpar filtro
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
