"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { InputComponent } from "@/components/shared/input-component";
import { MultiSelectCombobox } from "@/components/shared/multi-select-combobox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type {
  ServiceItemStatusFilter,
  UseServiceItemsFiltersReturn,
} from "@/hooks/works-panel/service-item/use-service-items-filters";
import { cn } from "@/lib/utils/cn";

const STATUS_OPTIONS: { value: ServiceItemStatusFilter; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "ACTIVE", label: "Ativos" },
  { value: "INACTIVE", label: "Inativos" },
];

interface ServiceItemsFilterSheetProps {
  filters: UseServiceItemsFiltersReturn;
  segments: SegmentResponseType[];
  measures: MeasureResponseType[];
}

export function ServiceItemsFilterSheet({
  filters,
  segments,
  measures,
}: ServiceItemsFilterSheetProps) {
  const {
    draftFilters,
    setDraftFilters,
    activeFiltersCount,
    isOpen,
    onOpenChange,
    applyDraftFilters,
    clearDraftFilters,
  } = filters;

  const segmentOptions = segments.map((segment) => ({
    value: String(segment.id),
    label: segment.name,
  }));

  const measureOptions = measures.map((measure) => ({
    value: String(measure.id),
    label: measure.name,
  }));

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="relative h-10 shrink-0 cursor-pointer gap-1.5 border-panel-border bg-panel-page/60 text-panel-surface-foreground hover:bg-panel-border"
        >
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-panel-accent text-xs font-semibold text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-surface p-0 sm:max-w-md!"
      >
        <SheetHeader className="flex-row shrink-0 items-start justify-between gap-4 space-y-0 border-b border-panel-border p-4 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <SheetTitle className="font-bold text-panel-surface-foreground">
              Filtrar serviços
            </SheetTitle>
            <SheetDescription className="text-panel-muted-foreground">
              Refine a lista de serviços pelos critérios abaixo.
            </SheetDescription>
          </div>
          <SheetClose className="cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Segmento
            </span>
            <MultiSelectCombobox
              options={segmentOptions}
              value={draftFilters.segmentIds}
              onChange={(segmentIds) =>
                setDraftFilters((current) => ({ ...current, segmentIds }))
              }
              placeholder="Todos os segmentos"
              searchPlaceholder="Buscar segmento..."
              emptyMessage="Nenhum segmento encontrado."
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Medida
            </span>
            <MultiSelectCombobox
              options={measureOptions}
              value={draftFilters.measureIds}
              onChange={(measureIds) =>
                setDraftFilters((current) => ({ ...current, measureIds }))
              }
              placeholder="Todas as medidas"
              searchPlaceholder="Buscar medida..."
              emptyMessage="Nenhuma medida encontrada."
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Status
            </span>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setDraftFilters((current) => ({
                      ...current,
                      status: option.value,
                    }))
                  }
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-xs font-semibold tracking-widest transition-colors",
                    draftFilters.status === option.value
                      ? "border-panel-accent bg-panel-accent text-white"
                      : "border-panel-border bg-panel-page/60 text-panel-muted-foreground hover:border-panel-accent/40 hover:text-panel-surface-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-panel-surface-foreground">
              Faixa de preço base
            </span>
            <div className="flex items-center gap-2">
              <InputComponent.root className="items-start">
                <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
                  <InputComponent.maskedCurrency
                    id="min-price"
                    value={draftFilters.minPrice}
                    onChange={(value) =>
                      setDraftFilters((current) => ({
                        ...current,
                        minPrice: value,
                      }))
                    }
                    placeHolder="Mínimo"
                    className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                  />
                </InputComponent.wrapper>
              </InputComponent.root>
              <span className="shrink-0 text-panel-muted-foreground">até</span>
              <InputComponent.root className="items-start">
                <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
                  <InputComponent.maskedCurrency
                    id="max-price"
                    value={draftFilters.maxPrice}
                    onChange={(value) =>
                      setDraftFilters((current) => ({
                        ...current,
                        maxPrice: value,
                      }))
                    }
                    placeHolder="Máximo"
                    className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                  />
                </InputComponent.wrapper>
              </InputComponent.root>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-0 shrink-0 flex-col-reverse gap-2 border-t border-panel-border p-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full cursor-pointer hover:bg-panel-border sm:w-auto"
            onClick={clearDraftFilters}
          >
            Limpar
          </Button>
          <Button
            type="button"
            className="w-full cursor-pointer sm:w-auto"
            onClick={applyDraftFilters}
          >
            Aplicar filtros
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
