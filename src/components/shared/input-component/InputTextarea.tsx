import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
}

export const InputTextarea = forwardRef<
  HTMLTextAreaElement,
  InputTextareaProps
>(function InputTextarea(
  { id, className, placeHolder, readOnly, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      {...props}
      ref={ref}
      id={id}
      rows={rows}
      tabIndex={readOnly ? -1 : 0}
      placeholder={placeHolder}
      readOnly={readOnly}
      className={cn(
        "w-full h-full resize-none focus:outline-none flex",
        className,
      )}
    />
  );
});
