"use client";

import type { FieldErrors, UseFormReturn } from "react-hook-form";
import { Controller, useFormState } from "react-hook-form";
import { InputComponent } from "@/components/shared/input-component";
import { cn } from "@/lib/utils/cn";
import type {
  AddressRegisterFormData,
  AddressRegisterFormOutput,
} from "@/schema/landingpage/cart/address-register-schema";

const ADDRESS_TYPE_OPTIONS = [
  { value: "RESIDENTIAL", label: "RESIDENCIAL" },
  { value: "COMMERCIAL", label: "COMERCIAL" },
] as const;

export interface CustomerAddressFieldsBundle {
  form: UseFormReturn<
    AddressRegisterFormData,
    unknown,
    AddressRegisterFormOutput
  >;
  onSubmit: (data: AddressRegisterFormOutput) => void | Promise<void>;
  onInvalid: (errors: FieldErrors<AddressRegisterFormData>) => void;
  handleCepComplete: (cep: string) => void | Promise<void>;
}

type CustomerAddressFieldsProps = CustomerAddressFieldsBundle & {
  formId: string;
};

export function CustomerAddressFields({
  form,
  onSubmit,
  onInvalid,
  handleCepComplete,
  formId,
}: CustomerAddressFieldsProps) {
  const { control, register, handleSubmit } = form;
  const { errors, isSubmitting } = useFormState({ control });

  return (
    <form
      id={formId}
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-panel-surface-foreground">
          Tipo de endereço
        </span>
        <Controller
          control={control}
          name="type"
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
            htmlFor={`${formId}-cep`}
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
        >
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <InputComponent.maskedCep
                id={`${formId}-cep`}
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
            htmlFor={`${formId}-state`}
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
          <InputComponent.inputBase
            id={`${formId}-state`}
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
            htmlFor={`${formId}-city`}
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
          <InputComponent.inputBase
            id={`${formId}-city`}
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
            htmlFor={`${formId}-neighborhood`}
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
          <InputComponent.inputBase
            id={`${formId}-neighborhood`}
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
            htmlFor={`${formId}-street`}
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
          <InputComponent.inputBase
            id={`${formId}-street`}
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
            htmlFor={`${formId}-number`}
            classNameLabel="text-sm font-medium text-panel-surface-foreground"
          />
        </div>
        <InputComponent.wrapper classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-page/60 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
          <InputComponent.inputBase
            id={`${formId}-number`}
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
