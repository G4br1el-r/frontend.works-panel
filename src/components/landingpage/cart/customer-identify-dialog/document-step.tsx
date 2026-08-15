"use client";

import { Search } from "lucide-react";
import { Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { DialogFooter } from "@/components/ui/dialog";
import type { UseDocumentLookupReturn } from "@/hooks/landingpage/cart/use-document-lookup";

const FIELD_LABEL_CLASSNAME =
  "text-xs font-semibold tracking-widest text-brand";

const FIELD_INPUT_CLASSNAME =
  "border border-white/10 bg-white/5 px-3 py-2.5 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand sm:text-sm";

type DocumentStepProps = UseDocumentLookupReturn;

export function DocumentStep({ form, onSubmit, onInvalid }: DocumentStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mt-6 flex flex-col gap-4"
      noValidate
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-document" className={FIELD_LABEL_CLASSNAME}>
          CPF OU CNPJ
        </label>
        <Controller
          control={control}
          name="document"
          render={({ field }) => (
            <IMaskInput
              id="customer-document"
              mask={[
                { mask: "000.000.000-00" },
                { mask: "00.000.000/0000-00" },
              ]}
              inputMode="numeric"
              placeholder="000.000.000-00"
              className={FIELD_INPUT_CLASSNAME}
              value={field.value}
              onAccept={(value) => field.onChange(value)}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.document && (
          <p className="text-xs text-red-400">{errors.document.message}</p>
        )}
      </div>

      <DialogFooter>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98 disabled:pointer-events-none disabled:opacity-60"
        >
          <Search size={14} aria-hidden="true" />
          CONTINUAR
        </button>
      </DialogFooter>
    </form>
  );
}
