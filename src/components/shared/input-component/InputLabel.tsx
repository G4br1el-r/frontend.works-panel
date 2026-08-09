import { cn } from "@/lib/utils";

interface InputLabelProps {
  label: string;
  htmlFor: string;
  readOnly?: boolean;
  classNameLabel?: string;
  required?: boolean;
}

export function InputLabel({
  label,
  htmlFor,
  readOnly,
  classNameLabel,
  required,
}: InputLabelProps) {
  return (
    <label className="flex items-center gap-1" htmlFor={htmlFor}>
      <span
        className={cn(
          "font-bold transition-colors duration-300",
          classNameLabel,
        )}
      >
        {label}
      </span>
      {required && <span className="text-red-500 text-xs">*</span>}
    </label>
  );
}
