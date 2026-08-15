"use client";

import { Controller, useFormState } from "react-hook-form";
import { InputComponent } from "@/components/shared/input-component";
import type { UseCreateNewCustomerReturn } from "@/hooks/works-panel/customer/use-create-new-customer";
import { cn } from "@/lib/utils/cn";

const ADDRESS_TYPE_OPTIONS = [
  { value: "RESIDENTIAL", label: "RESIDENCIAL" },
  { value: "COMMERCIAL", label: "COMERCIAL" },
] as const;

type CreateCustomerFormProps = UseCreateNewCustomerReturn & {
  formId: string;
};

export function CreateCustomerForm({
  form,
  onInvalid,
  onSubmit,
  handleCepComplete,
  formId,
}: CreateCustomerFormProps) {
  const { control, register, handleSubmit } = form;
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
                placeHolder="Nome do cliente"
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
            label="Celular"
            htmlFor="cellPhone"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          iconName="phone"
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.cellPhone
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="cellPhone"
            render={({ field }) => (
              <InputComponent.maskedPhone
                id="cellPhone"
                value={field.value}
                onChange={field.onChange}
                placeHolder="(00) 00000-0000"
                readOnly={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="CPF/CNPJ"
            htmlFor="document"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          iconName="fileText"
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.document
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="document"
            render={({ field }) => (
              <InputComponent.maskedDocument
                id="document"
                value={field.value}
                onChange={field.onChange}
                placeHolder="000.000.000-00"
                readOnly={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-panel-surface-foreground">
          Tipo de endereço
        </span>
        <Controller
          control={control}
          name="addressType"
          render={({ field }) => (
            <div className="flex gap-2">
              {ADDRESS_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "flex-1 cursor-pointer rounded-lg border px-3 py-2.5 text-xs font-semibold tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                    field.value === option.value
                      ? "border-panel-accent bg-panel-accent text-white"
                      : "border-panel-border bg-panel-page/60 text-panel-muted-foreground hover:border-panel-accent/40 hover:text-panel-surface-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="CEP da obra"
            htmlFor="cep"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper={cn(
            "h-11 rounded-lg border border-panel-border bg-panel-page/60",
            errors.cep
              ? "animate-shake border-destructive"
              : "focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
          )}
          classNameIcon="text-panel-muted-foreground"
        >
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <InputComponent.maskedCep
                id="cep"
                value={field.value}
                onChange={field.onChange}
                onAcceptUnmasked={(unmasked) => {
                  if (unmasked.length === 8) handleCepComplete(unmasked);
                }}
                placeHolder="00000-000"
                readOnly={isSubmitting}
                className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              />
            )}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="UF"
            htmlFor="state"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
          classNameIcon="text-panel-muted-foreground"
        >
          <InputComponent.inputBase
            id="state"
            type="text"
            placeHolder="UF"
            disabled={isSubmitting}
            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
            {...register("state")}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Cidade"
            htmlFor="city"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
          classNameIcon="text-panel-muted-foreground"
        >
          <InputComponent.inputBase
            id="city"
            type="text"
            placeHolder="Cidade"
            disabled={isSubmitting}
            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
            {...register("city")}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Bairro"
            htmlFor="neighborhood"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
          classNameIcon="text-panel-muted-foreground"
        >
          <InputComponent.inputBase
            id="neighborhood"
            type="text"
            placeHolder="Bairro"
            disabled={isSubmitting}
            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
            {...register("neighborhood")}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Rua"
            htmlFor="street"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
          classNameIcon="text-panel-muted-foreground"
        >
          <InputComponent.inputBase
            id="street"
            type="text"
            placeHolder="Rua"
            disabled={isSubmitting}
            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
            {...register("street")}
          />
        </InputComponent.wrapper>
      </InputComponent.root>

      <InputComponent.root>
        <div className="w-full">
          <InputComponent.label
            label="Número"
            htmlFor="number"
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper
          classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
          classNameIcon="text-panel-muted-foreground"
        >
          <InputComponent.inputBase
            id="number"
            type="text"
            placeHolder="Nº"
            disabled={isSubmitting}
            className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
            {...register("number")}
          />
        </InputComponent.wrapper>
      </InputComponent.root>
    </form>
  );
}
