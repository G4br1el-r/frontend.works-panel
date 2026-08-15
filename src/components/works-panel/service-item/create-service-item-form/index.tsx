"use client";

import { Info } from "lucide-react";
import { Controller, useFormState } from "react-hook-form";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { InputComponent } from "@/components/shared/input-component";
import { MultiSelectCombobox } from "@/components/shared/multi-select-combobox";
import { SelectCombobox } from "@/components/shared/select-combobox";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Switch } from "@/components/ui/switch";
import type { UseCreateNewServiceItemReturn } from "@/hooks/works-panel/service-item/use-create-new-service-item";
import { cn } from "@/lib/utils/cn";

type CreateServiceItemFormProps = UseCreateNewServiceItemReturn & {
  formId: string;
  measures: MeasureResponseType[];
  segments: SegmentResponseType[];
  materials: MaterialResponseType[];
};

export function CreateServiceItemForm({
  form,
  onInvalid,
  onSubmit,
  formId,
  measures,
  segments,
  materials,
}: CreateServiceItemFormProps) {
  const { control, handleSubmit } = form;
  const { errors, isSubmitting } = useFormState({ control });

  const measureOptions = measures.map((measure) => ({
    value: String(measure.id),
    label: measure.name,
    disabled: !measure.active,
    hint: measure.active ? undefined : "Inativa",
  }));

  const segmentOptions = segments.map((segment) => ({
    value: String(segment.id),
    label: segment.name,
    disabled: !segment.active,
    hint: segment.active ? undefined : "Inativo",
  }));

  const materialOptions = materials.map((material) => ({
    value: String(material.id),
    label: material.name,
    disabled: !material.active,
    hint: material.active ? undefined : "Inativo",
  }));

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Nome"
            htmlFor="name"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          iconName="wrench"
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.name
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputComponent.inputBase
                id="name"
                type="text"
                placeHolder="Nome do serviço"
                disabled={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                {...field}
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Preço base"
            htmlFor="basePrice"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Valor de referência da mão de obra usado para calcular os orçamentos.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <InputComponent.wrapper
          iconName="wallet"
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.basePrice
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="basePrice"
            render={({ field }) => (
              <InputComponent.maskedCurrency
                id="basePrice"
                value={field.value}
                onChange={field.onChange}
                placeHolder="R$ 0,00"
                disabled={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Segmento"
            htmlFor="segmentId"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Frente de serviço em que esse item aparece na sua página.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <Controller
          control={control}
          name="segmentId"
          render={({ field }) => (
            <SelectCombobox
              id="segmentId"
              options={segmentOptions}
              value={field.value ? String(field.value) : null}
              onChange={(value) => field.onChange(value ? Number(value) : null)}
              disabled={isSubmitting}
              hasError={Boolean(errors.segmentId)}
              placeholder="Selecione o segmento"
              searchPlaceholder="Buscar segmento..."
              emptyMessage="Nenhum segmento encontrado."
            />
          )}
        />
      </InputComponent.root>

      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Medida"
            htmlFor="measureId"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Unidade em que esse serviço é cobrado.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <Controller
          control={control}
          name="measureId"
          render={({ field }) => (
            <SelectCombobox
              id="measureId"
              options={measureOptions}
              value={field.value ? String(field.value) : null}
              onChange={(value) => field.onChange(value ? Number(value) : null)}
              disabled={isSubmitting}
              hasError={Boolean(errors.measureId)}
              placeholder="Selecione a medida"
              searchPlaceholder="Buscar medida..."
              emptyMessage="Nenhuma medida encontrada."
            />
          )}
        />
      </InputComponent.root>

      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Materiais"
            htmlFor="materialIds"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Insumos normalmente usados na execução desse serviço.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <Controller
          control={control}
          name="materialIds"
          render={({ field }) => (
            <MultiSelectCombobox
              id="materialIds"
              options={materialOptions}
              value={(field.value ?? []).map(String)}
              onChange={(value) => field.onChange(value.map(Number))}
              disabled={isSubmitting}
              hasError={Boolean(errors.materialIds)}
              placeholder="Selecione os materiais"
              searchPlaceholder="Buscar material..."
              emptyMessage="Nenhum material encontrado."
            />
          )}
        />
      </InputComponent.root>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-panel-border bg-panel-page/60 px-3 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-panel-surface-foreground">
            Serviço ativo
          </span>
          <span className="text-xs text-panel-muted-foreground">
            Serviços inativos não aparecem para seleção em novos orçamentos.
          </span>
        </div>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>
    </form>
  );
}
