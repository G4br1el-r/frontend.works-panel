"use client";

import { useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";
import { isoToMaskedDate, maskedDateToIso } from "@/lib/utils/maskedDate";

interface InputMaskedDateIsoProps {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (isoValue: string) => void;
  "aria-invalid"?: boolean;
}

export function InputMaskedDateIso({
  id,
  className,
  placeHolder,
  readOnly,
  value = "",
  onChange,
  "aria-invalid": ariaInvalid,
}: InputMaskedDateIsoProps) {
  const [maskedValue, setMaskedValue] = useState(() => isoToMaskedDate(value));

  useEffect(() => {
    setMaskedValue((current: string) =>
      maskedDateToIso(current) === value ? current : isoToMaskedDate(value),
    );
  }, [value]);

  return (
    <IMaskInput
      mask="00/00/0000"
      unmask={false}
      value={maskedValue}
      onAccept={(newValue: string) => {
        setMaskedValue(newValue);
        onChange?.(maskedDateToIso(newValue));
      }}
      id={id}
      tabIndex={readOnly ? -1 : 0}
      placeholder={placeHolder}
      readOnly={readOnly}
      aria-invalid={ariaInvalid}
      className={cn("w-full h-full focus:outline-none flex", className)}
    />
  );
}
