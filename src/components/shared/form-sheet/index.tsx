import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FormSheetProps {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  saveLabel?: string;
  clearLabel?: string;
  formId: string;
  onClear?: () => void;
  disabled?: boolean;
}

export function FormSheet({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  saveLabel = "Salvar",
  clearLabel = "Limpar",
  formId,
  onClear,
  disabled,
}: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-surface p-0 sm:max-w-md!"
      >
        <SheetHeader className="flex-row shrink-0 items-start justify-between gap-4 space-y-0 border-b border-panel-border p-4 sm:p-6">
          <div className="flex flex-col gap-1.5">
            <SheetTitle className="font-bold text-panel-surface-foreground">
              {title}
            </SheetTitle>
            {description && (
              <SheetDescription className="text-panel-muted-foreground">
                {description}
              </SheetDescription>
            )}
          </div>
          <SheetClose className="cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

        <SheetFooter className="mt-0 shrink-0 flex-col-reverse gap-2 border-t border-panel-border p-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="w-full cursor-pointer hover:bg-panel-border sm:w-auto"
            onClick={onClear}
            disabled={disabled}
          >
            {clearLabel}
          </Button>
          <Button
            form={formId}
            type="submit"
            className="w-full cursor-pointer sm:w-auto"
            disabled={disabled}
          >
            {saveLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
