"use client";

import { Info } from "lucide-react";
import { Controller, useFormState } from "react-hook-form";
import { InputComponent } from "@/components/shared/input-component";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Switch } from "@/components/ui/switch";
import type { UseCreateNewMeasureReturn } from "@/hooks/works-panel/measure/use-create-new-measure";
import { cn } from "@/lib/utils/cn";

type CreateMeasureFormProps = UseCreateNewMeasureReturn & {
  formId: string;
};

export function CreateMeasureForm({
  form,
  onInvalid,
  onSubmit,
  formId,
}: CreateMeasureFormProps) {
  const { control, handleSubmit } = form;
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Nome"
            htmlFor="name"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Unidade usada para medir serviços e materiais, como metro, hora ou unidade.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <InputComponent.wrapper
          iconName="ruler"
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
                placeHolder="Nome da medida"
                disabled={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                {...field}
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-panel-border bg-panel-page/60 px-3 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-panel-surface-foreground">
            Medida ativa
          </span>
          <span className="text-xs text-panel-muted-foreground">
            Medidas inativas não aparecem para seleção em novos cadastros.
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
