"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
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

export interface MultiSelectComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  hint?: string;
}

interface MultiSelectComboboxProps {
  id?: string;
  options: MultiSelectComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export function MultiSelectCombobox({
  id,
  options,
  value,
  onChange,
  placeholder = "Selecione os itens",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum item encontrado.",
  disabled,
  hasError,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  function toggleOption(option: MultiSelectComboboxOption) {
    if (option.disabled) return;

    if (value.includes(option.value)) {
      onChange(value.filter((item) => item !== option.value));
      return;
    }

    onChange([...value, option.value]);
  }

  return (
    <div className="flex w-full flex-col gap-2">
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
                selectedOptions.length > 0
                  ? "text-panel-surface-foreground"
                  : "text-panel-muted-foreground",
              )}
            >
              {selectedOptions.length > 0
                ? `${selectedOptions.length} ${selectedOptions.length > 1 ? "itens selecionados" : "item selecionado"}`
                : placeholder}
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
                    onSelect={() => toggleOption(option)}
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
                        value.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0",
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

      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedOptions.map((option) => (
            <span
              key={option.value}
              className="flex items-center gap-1 rounded-full border border-panel-border bg-panel-page/60 py-1.5 pr-2 pl-3 text-xs text-panel-surface-foreground"
            >
              {option.label}
              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((item) => item !== option.value))
                }
                disabled={disabled}
                className="flex size-4 cursor-pointer items-center justify-center rounded-full text-panel-muted-foreground transition-colors hover:bg-panel-border hover:text-panel-surface-foreground"
              >
                <X className="size-2.5" strokeWidth={2.5} />
                <span className="sr-only">Remover {option.label}</span>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
