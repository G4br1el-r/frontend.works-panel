"use client";

import { Controller, useFormState } from "react-hook-form";
import { InputComponent } from "@/components/shared/input-component";
import type { UseCreateNewEmployeerReturn } from "@/hooks/works-panel/employeer/use-create-new-employeer";
import { cn } from "@/lib/utils/cn";

type CreateEmployeerFormProps = UseCreateNewEmployeerReturn & {
  formId?: string;
};

export function CreateEmployeerForm({
  form,
  onInvalid,
  onSubmit,
  formId = "create-employeer-form",
}: CreateEmployeerFormProps) {
  const { control, handleSubmit } = form;
  const { errors, isSubmitting } = useFormState({ control });

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
          iconName="user"
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
                placeHolder="Nome do funcionário"
                disabled={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                {...field}
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Valor da diária"
            htmlFor="dailyRate"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          iconName="wallet"
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.dailyRate
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="dailyRate"
            render={({ field }) => (
              <InputComponent.maskedCurrency
                id="dailyRate"
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
    </form>
  );
}
