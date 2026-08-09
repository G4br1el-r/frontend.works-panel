"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface InputMaskedPhoneProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onAcceptUnmasked?: (unmaskedValue: string) => void;
}

export const InputMaskedPhone = forwardRef<
  HTMLInputElement,
  InputMaskedPhoneProps
>(function InputMaskedPhone(
  { id, className, placeHolder, readOnly, value, onChange, onAcceptUnmasked },
  ref,
) {
  return (
    <IMaskInput
      mask={[
        { mask: "(00) 0000-0000", maxLength: 10 },
        { mask: "(00) 00000-0000" },
      ]}
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
});
