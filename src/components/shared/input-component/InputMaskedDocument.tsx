"use client";

import { forwardRef } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface InputMaskedDocumentProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onAcceptUnmasked?: (unmaskedValue: string) => void;
}

export const InputMaskedDocument = forwardRef<
  HTMLInputElement,
  InputMaskedDocumentProps
>(function InputMaskedDocument(
  { id, className, placeHolder, readOnly, value, onChange, onAcceptUnmasked },
  ref,
) {
  return (
    <IMaskInput
      mask={[
        { mask: "000.000.000-00", maxLength: 11 },
        { mask: "00.000.000/0000-00" },
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
