"use client";

import { X } from "lucide-react";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function formatCurrency(value: string) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ServiceItemMaterialsDialogProps {
  serviceItem: ServiceItemResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceItemMaterialsDialog({
  serviceItem,
  open,
  onOpenChange,
}: ServiceItemMaterialsDialogProps) {
  const materials = serviceItem?.materials ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-lg border-panel-border bg-panel-surface p-0 sm:p-0"
      >
        <DialogHeader className="flex-row shrink-0 items-start justify-between gap-4 space-y-0 border-b border-panel-border p-4 sm:p-6">
          <div className="flex flex-col">
            <DialogTitle className="font-bold text-panel-surface-foreground">
              Materiais vinculados
            </DialogTitle>
            <DialogDescription className="text-panel-muted-foreground">
              {serviceItem ? `Insumos usados em "${serviceItem.name}".` : ""}
            </DialogDescription>
          </div>
          <DialogClose className="cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-2 overflow-y-auto p-4 sm:p-6">
          {materials.length > 0 ? (
            <ul className="flex flex-col divide-y divide-panel-border">
              {materials.map((material) => (
                <li
                  key={material.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-sm"
                >
                  <span className="text-panel-surface-foreground">
                    {material.name}
                  </span>
                  <span className="flex items-center gap-2 text-panel-muted-foreground">
                    {material.measure && (
                      <span className="rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs">
                        {material.measure.name}
                      </span>
                    )}
                    {formatCurrency(material.basePrice)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-panel-muted-foreground">
              Nenhum material vinculado a este serviço.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
