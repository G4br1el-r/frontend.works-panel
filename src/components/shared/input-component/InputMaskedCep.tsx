"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface InputMaskedCepProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onAcceptUnmasked?: (unmaskedValue: string) => void;
}

export const InputMaskedCep = forwardRef<HTMLInputElement, InputMaskedCepProps>(
  function InputMaskedCep(
    { id, className, placeHolder, readOnly, value, onChange, onAcceptUnmasked },
    ref,
  ) {
    return (
      <IMaskInput
        mask="00000-000"
        unmask={false}
        value={value}
        onAccept={(newValue: string, maskRef: { unmaskedValue: string }) => {
          onChange?.(newValue);
          onAcceptUnmasked?.(maskRef.unmaskedValue);
        }}
        inputRef={ref}
        id={id}
        tabIndex={readOnly ? -1 : 0}
        placeholder={placeHolder}
        readOnly={readOnly}
        className={cn("w-full h-full focus:outline-none flex", className)}
      />
    );
  },
);
