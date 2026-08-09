"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface InputMaskedDateProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const InputMaskedDate = forwardRef<
  HTMLInputElement,
  InputMaskedDateProps
>(function InputMaskedDate(
  { id, className, placeHolder, readOnly, defaultValue, onChange },
  ref,
) {
  return (
    <IMaskInput
      mask="00/00/0000"
      unmask={false}
      defaultValue={defaultValue}
      onAccept={(newValue: string) => onChange?.(newValue)}
      inputRef={ref}
      id={id}
      tabIndex={readOnly ? -1 : 0}
      placeholder={placeHolder}
      readOnly={readOnly}
      className={cn("w-full h-full focus:outline-none flex", className)}
    />
  );
});
