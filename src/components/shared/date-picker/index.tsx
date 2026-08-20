"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";

function parseDateValue(value?: string) {
  if (!value) return undefined;
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

interface DatePickerProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function DatePicker({ id, value, onChange, placeholder = "Selecione a data", disabled, hasError }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateValue(value);

  function handleSelect(date: Date | undefined) {
    if (!date) return;
    onChange(format(date, "dd/MM/yyyy"));
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center gap-2 rounded-lg border border-panel-border bg-panel-surface px-3 text-left text-base outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
            hasError
              ? "animate-shake border-destructive"
              : "focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20",
          )}
        >
          <CalendarIcon className="size-4 shrink-0 text-panel-muted-foreground" />
          <span className={cn("truncate", selectedDate ? "text-panel-surface-foreground" : "text-panel-muted-foreground")}>
            {selectedDate ? format(selectedDate, "dd/MM/yyyy") : placeholder}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-fit rounded-lg border border-panel-border bg-panel-surface p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={ptBR}
          className="bg-panel-surface text-panel-surface-foreground"
        />
      </PopoverContent>
    </Popover>
  );
}
