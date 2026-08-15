"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils/cn";

export interface SelectComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  hint?: string;
}

interface SelectComboboxProps {
  id?: string;
  options: SelectComboboxOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function SelectCombobox({
  id,
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum item encontrado.",
  disabled,
  hasError,
}: SelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  function handleSelect(option: SelectComboboxOption) {
    if (option.disabled) return;

    onChange(option.value === value ? null : option.value);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-panel-border bg-panel-page/60 px-3 text-left text-base transition-all disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
            hasError
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
        >
          <span
            className={cn(
              "truncate",
              selectedOption
                ? "text-panel-surface-foreground"
                : "text-panel-muted-foreground",
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-panel-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) rounded-lg border border-panel-border bg-panel-surface p-0 text-panel-surface-foreground"
      >
        <Command className="bg-transparent text-panel-surface-foreground">
          <CommandInput
            placeholder={searchPlaceholder}
            className="text-panel-surface-foreground placeholder:text-panel-muted-foreground"
          />
          <CommandList>
            <CommandEmpty className="text-panel-muted-foreground">
              {emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => handleSelect(option)}
                  className={cn(
                    "text-panel-surface-foreground data-[selected=true]:bg-panel-page data-[selected=true]:text-panel-surface-foreground",
                    option.disabled
                      ? "cursor-not-allowed text-panel-muted-foreground opacity-50"
                      : "cursor-pointer",
                  )}
                >
                  <Check
                    className={cn(
                      "size-4 text-panel-accent",
                      option.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.hint && (
                    <span className="shrink-0 text-xs text-panel-muted-foreground">
                      {option.hint}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
