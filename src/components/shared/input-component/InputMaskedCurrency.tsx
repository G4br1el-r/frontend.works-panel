"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputMaskedCurrencyProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onAcceptUnmasked?: (unmaskedValue: string) => void;
}

function centsToBRL(digits: string) {
  if (!digits) return "";
  return (Number(digits) / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const InputMaskedCurrency = forwardRef<
  HTMLInputElement,
  InputMaskedCurrencyProps
>(function InputMaskedCurrency(
  {
    id,
    className,
    placeHolder,
    readOnly,
    disabled,
    value,
    onChange,
    onAcceptUnmasked,
  },
  ref,
) {
  return (
    <input
      ref={ref}
      id={id}
      type="text"
      inputMode="decimal"
      value={value ?? ""}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, "");
        onChange?.(centsToBRL(digits));
        onAcceptUnmasked?.(digits ? (Number(digits) / 100).toString() : "");
      }}
      tabIndex={readOnly ? -1 : 0}
      placeholder={placeHolder}
      readOnly={readOnly}
      disabled={disabled}
      className={cn("w-full h-full focus:outline-none flex", className)}
    />
  );
});
