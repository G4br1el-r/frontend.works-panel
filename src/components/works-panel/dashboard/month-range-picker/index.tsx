"use client";

import { endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";
import { toApiDate } from "@/lib/utils/dashboard";

interface MonthRangePickerProps {
  from: string | null;
  to: string | null;
  disabled?: boolean;
  onChange: (range: { from: string | null; to: string | null }) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index);

const PRESETS = [
  /** `months: null` limpa o filtro — volta a considerar todo o histórico. */
  { label: "Todo o período", months: null },
  { label: "Este mês", months: 0 },
  { label: "Últimos 3 meses", months: 2 },
  { label: "Últimos 6 meses", months: 5 },
  { label: "Últimos 12 meses", months: 11 },
] as const;

function monthKeyOf(iso: string | null): string | null {
  return iso ? iso.slice(0, 7) : null;
}

function formatLabel(from: string | null, to: string | null): string | null {
  if (!from && !to) return null;

  const fromLabel = from
    ? format(new Date(`${from}T00:00:00`), "MMM/yy", { locale: ptBR })
    : "início";
  const toLabel = to
    ? format(new Date(`${to}T00:00:00`), "MMM/yy", { locale: ptBR })
    : "hoje";

  return fromLabel === toLabel ? fromLabel : `${fromLabel} — ${toLabel}`;
}

/**
 * Seleção por mês: o primeiro clique marca o início, o segundo fecha o
 * intervalo. Clicar de novo recomeça — assim dá para escolher um mês só ou
 * uma faixa, sem dois campos separados.
 */
export function MonthRangePicker({
  from,
  to,
  disabled,
  onChange,
}: MonthRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() =>
    from ? Number(from.slice(0, 4)) : new Date().getFullYear(),
  );
  const [pendingStart, setPendingStart] = useState<string | null>(null);

  const label = formatLabel(from, to);
  const fromKey = monthKeyOf(from);
  const toKey = monthKeyOf(to);

  function handleSelectMonth(monthIndex: number) {
    const monthDate = new Date(year, monthIndex, 1);
    const key = format(monthDate, "yyyy-MM");

    if (!pendingStart) {
      setPendingStart(key);
      onChange({
        from: toApiDate(startOfMonth(monthDate)),
        to: toApiDate(endOfMonth(monthDate)),
      });
      return;
    }

    // Segundo clique fecha o intervalo, aceitando seleção em ordem inversa.
    const [startKey, endKey] =
      key < pendingStart ? [key, pendingStart] : [pendingStart, key];
    const start = new Date(
      Number(startKey.slice(0, 4)),
      Number(startKey.slice(5, 7)) - 1,
      1,
    );
    const end = new Date(
      Number(endKey.slice(0, 4)),
      Number(endKey.slice(5, 7)) - 1,
      1,
    );

    onChange({
      from: toApiDate(startOfMonth(start)),
      to: toApiDate(endOfMonth(end)),
    });
    setPendingStart(null);
    setOpen(false);
  }

  function handlePreset(months: number | null) {
    if (months === null) {
      onChange({ from: null, to: null });
      setPendingStart(null);
      setOpen(false);
      return;
    }

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - months, 1);

    onChange({
      from: toApiDate(startOfMonth(start)),
      to: toApiDate(endOfMonth(now)),
    });
    setPendingStart(null);
    setOpen(false);
  }

  function isInRange(key: string) {
    if (!fromKey || !toKey) return false;
    return key >= fromKey && key <= toKey;
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setPendingStart(null);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className="flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-panel-border bg-panel-surface px-3 text-left text-base outline-none transition-all focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-56 sm:text-sm lg:shrink-0"
        >
          <CalendarIcon className="size-4 shrink-0 text-panel-muted-foreground" />
          <span
            className={cn(
              "truncate first-letter:uppercase",
              label
                ? "text-panel-surface-foreground"
                : "text-panel-muted-foreground",
            )}
          >
            {label ?? "Todo o período"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-fit max-w-[calc(100vw-1.5rem)] rounded-lg border border-panel-border bg-panel-surface p-0"
      >
        <div className="flex flex-col gap-1 border-panel-border border-b p-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePreset(preset.months)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                preset.months === null && !from && !to
                  ? "bg-panel-accent-light font-medium text-panel-accent"
                  : "text-panel-surface-foreground hover:bg-panel-page",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

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
            <span className="font-medium text-panel-surface-foreground text-sm tabular-nums">
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
              const key = format(new Date(year, monthIndex, 1), "yyyy-MM");
              const selected = isInRange(key);
              const isPendingStart = pendingStart === key;

              return (
                <button
                  key={monthIndex}
                  type="button"
                  onClick={() => handleSelectMonth(monthIndex)}
                  className={cn(
                    "cursor-pointer rounded-md px-2 py-1.5 text-xs capitalize transition-colors",
                    selected || isPendingStart
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

          <p className="text-panel-muted-foreground text-xs">
            {pendingStart
              ? "Selecione o mês final"
              : "Clique em um mês, ou em dois para um intervalo"}
          </p>
        </div>

        {(from || to) && (
          <div className="border-panel-border border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full cursor-pointer text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
              onClick={() => handlePreset(null)}
            >
              Limpar período
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
