import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  placeHolder?: string;
  readOnly?: boolean;
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  function InputBase({ id, className, placeHolder, readOnly, ...props }, ref) {
    return (
      <input
        {...props}
        ref={ref}
        id={id}
        tabIndex={readOnly ? -1 : 0}
        placeholder={placeHolder}
        readOnly={readOnly}
        className={cn("w-full h-full focus:outline-none flex", className)}
      />
    );
  },
);
