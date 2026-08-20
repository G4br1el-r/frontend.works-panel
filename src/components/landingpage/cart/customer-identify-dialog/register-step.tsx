"use client";

import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import type { UseCustomerRegisterReturn } from "@/hooks/landingpage/cart/use-customer-register";
import { cn } from "@/lib/utils/cn";

const FIELD_LABEL_CLASSNAME =
  "text-xs font-semibold tracking-widest text-brand";

const FIELD_INPUT_CLASSNAME =
  "border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand sm:text-sm";

const ADDRESS_TYPE_OPTIONS = [
  { value: "RESIDENTIAL", label: "RESIDENCIAL" },
  { value: "COMMERCIAL", label: "COMERCIAL" },
] as const;

type RegisterStepProps = UseCustomerRegisterReturn & {
  formId: string;
};

export function RegisterStep({
  form,
  onSubmit,
  onInvalid,
  handleCepComplete,
  formId,
}: RegisterStepProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-name" className={FIELD_LABEL_CLASSNAME}>
          NOME OU EMPRESA
        </label>
        <input
          id="register-name"
          type="text"
          placeholder="Seu nome ou o nome da empresa"
          className={FIELD_INPUT_CLASSNAME}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-400">{errors.name.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-cellphone" className={FIELD_LABEL_CLASSNAME}>
          CELULAR / WHATSAPP
        </label>
        <Controller
          control={control}
          name="cellPhone"
          render={({ field }) => (
            <IMaskInput
              id="register-cellphone"
              mask="(00) 00000-0000"
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              className={FIELD_INPUT_CLASSNAME}
              value={field.value}
              onAccept={(value) => field.onChange(value)}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.cellPhone && (
          <p className="text-xs text-red-400">{errors.cellPhone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-email" className={FIELD_LABEL_CLASSNAME}>
          E-MAIL
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="seu@email.com"
          className={FIELD_INPUT_CLASSNAME}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={FIELD_LABEL_CLASSNAME}>TIPO DE ENDEREÇO</span>
        <Controller
          control={control}
          name="addressType"
          render={({ field }) => (
            <div className="flex gap-2">
              {ADDRESS_TYPE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    "flex-1 cursor-pointer border px-3 py-2.5 text-xs font-semibold tracking-widest transition-colors",
                    field.value === option.value
                      ? "border-brand bg-brand text-black"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-brand/40 hover:text-white",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="register-cep" className={FIELD_LABEL_CLASSNAME}>
          CEP DA OBRA
        </label>
        <Controller
          control={control}
          name="cep"
          render={({ field }) => (
            <IMaskInput
              id="register-cep"
              mask="00000-000"
              inputMode="numeric"
              placeholder="00000-000"
              className={FIELD_INPUT_CLASSNAME}
              value={field.value}
              onAccept={(value, _mask, event) => {
                field.onChange(value);
                if (event && value.replace(/\D/g, "").length === 8) {
                  handleCepComplete(value);
                }
              }}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.cep && (
          <p className="text-xs text-red-400">{errors.cep.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-state" className={FIELD_LABEL_CLASSNAME}>
            UF
          </label>
          <input
            id="register-state"
            type="text"
            placeholder="UF"
            className={FIELD_INPUT_CLASSNAME}
            {...register("state")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-city" className={FIELD_LABEL_CLASSNAME}>
            CIDADE
          </label>
          <input
            id="register-city"
            type="text"
            placeholder="Cidade"
            className={FIELD_INPUT_CLASSNAME}
            {...register("city")}
          />
        </div>
      </div>
      {(errors.state || errors.city) && (
        <p className="-mt-2 text-xs text-red-400">
          {errors.state?.message ?? errors.city?.message}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="register-neighborhood"
          className={FIELD_LABEL_CLASSNAME}
        >
          BAIRRO
        </label>
        <input
          id="register-neighborhood"
          type="text"
          placeholder="Bairro"
          className={FIELD_INPUT_CLASSNAME}
          {...register("neighborhood")}
        />
        {errors.neighborhood && (
          <p className="text-xs text-red-400">{errors.neighborhood.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label htmlFor="register-street" className={FIELD_LABEL_CLASSNAME}>
            RUA
          </label>
          <input
            id="register-street"
            type="text"
            placeholder="Rua"
            className={FIELD_INPUT_CLASSNAME}
            {...register("street")}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="register-number" className={FIELD_LABEL_CLASSNAME}>
            NÚMERO
          </label>
          <input
            id="register-number"
            type="text"
            placeholder="Nº"
            className={FIELD_INPUT_CLASSNAME}
            {...register("number")}
          />
        </div>
      </div>
      {(errors.street || errors.number) && (
        <p className="-mt-2 text-xs text-red-400">
          {errors.street?.message ?? errors.number?.message}
        </p>
      )}
    </form>
  );
}
