import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FormDialogProps {
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

export function FormDialog({
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
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className="rounded-lg border-panel-border bg-panel-surface p-0 sm:p-0"
      >
        <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0 border-b border-panel-border p-6">
          <div className="flex flex-col">
            <DialogTitle className="text-panel-surface-foreground font-bold">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-panel-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </div>
          <DialogClose className="cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-6">{children}</div>

        <DialogFooter className="mt-0 flex-row justify-end gap-2 border-t border-panel-border p-3">
          <Button
            type="button"
            variant="secondary"
            className="hover:bg-panel-border cursor-pointer"
            onClick={onClear}
            disabled={disabled}
          >
            {clearLabel}
          </Button>
          <Button
            form={formId}
            type="submit"
            className="cursor-pointer"
            disabled={disabled}
          >
            {saveLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
