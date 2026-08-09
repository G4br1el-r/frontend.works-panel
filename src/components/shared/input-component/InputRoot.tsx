import { cn } from "@/lib/utils";

interface InputRootProps {
  children: React.ReactNode;
  className?: string;
  readOnly?: boolean;
}

export function InputRoot({ children, className, readOnly }: InputRootProps) {
  return (
    <div
      className={cn(
        "w-full items-center flex flex-col gap-1 justify-between group",
        readOnly && "pointer-events-none opacity-60",
        className,
      )}
    >
      {children}
    </div>
  );
}
