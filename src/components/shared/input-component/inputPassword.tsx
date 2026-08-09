import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputPasswordProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
  showPassword: boolean;
  placeHolder?: string;
  readOnly?: boolean;
  disable?: boolean;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
  function InputPassword(
    { id, className, showPassword, placeHolder, readOnly, disable, ...props },
    ref,
  ) {
    return (
      <input
        {...props}
        ref={ref}
        id={id}
        type={showPassword ? "text" : "password"}
        tabIndex={readOnly ? -1 : 0}
        placeholder={placeHolder}
        readOnly={readOnly}
        disabled={disable}
        className={cn("w-full h-full focus:outline-none flex", className)}
      />
    );
  },
);
