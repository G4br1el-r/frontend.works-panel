"use client";

import { Info } from "lucide-react";
import { Controller, useFormState } from "react-hook-form";
import { InputComponent } from "@/components/shared/input-component";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Switch } from "@/components/ui/switch";
import type { UseCreateNewSegmentReturn } from "@/hooks/works-panel/segment/use-create-new-segment";
import { cn } from "@/lib/utils/cn";
import { SegmentCoverUploadField } from "../segment-cover-upload-field";

type CreateSegmentFormProps = UseCreateNewSegmentReturn & {
  formId: string;
};

export function CreateSegmentForm({ form, onInvalid, onSubmit, formId }: CreateSegmentFormProps) {
  const { control, handleSubmit } = form;
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <form id={formId} className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Nome"
            htmlFor="name"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="É assim que esse segmento vai aparecer para os clientes na sua página.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <InputComponent.wrapper
          iconName="layers"
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
                placeHolder="Nome do segmento"
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
            label="Imagem de capa"
            htmlFor="coverImage"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Essa é a imagem que representa o segmento na sua página.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <Controller
          control={control}
          name="coverImage"
          render={({ field }) => (
            <SegmentCoverUploadField
              id="coverImage"
              value={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
              hasError={Boolean(errors.coverImage)}
            />
          )}
        />
      </InputComponent.root>

      <InputComponent.root>
        <div className="flex w-full items-center justify-start gap-2">
          <InputComponent.label
            label="Descrição"
            htmlFor="description"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
          <TooltipComponent content="Esse texto também vai aparecer na página, contando aos clientes o que você faz nesse segmento.">
            <Info className="h-3 w-3 text-panel-muted-foreground" />
          </TooltipComponent>
        </div>
        <InputComponent.wrapper
          iconName="fileText"
          classNameWrapper={cn(
            "h-auto min-h-24 items-start rounded-lg border border-panel-border bg-panel-page/60 py-2.5",
            errors.description
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="mt-0.5 text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <InputComponent.textarea
                id="description"
                placeHolder="Descreva o segmento"
                disabled={isSubmitting}
                rows={3}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                {...field}
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <div className="flex items-center justify-between gap-4 rounded-lg border border-panel-border bg-panel-page/60 px-3 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-panel-surface-foreground">Segmento ativo</span>
          <span className="text-xs text-panel-muted-foreground">
            Segmentos inativos não aparecem para seleção em novas obras.
          </span>
        </div>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
          )}
        />
      </div>
    </form>
  );
}
