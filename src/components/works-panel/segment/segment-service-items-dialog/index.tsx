"use client";

import { X } from "lucide-react";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
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

interface SegmentServiceItemsDialogProps {
  segment: SegmentResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SegmentServiceItemsDialog({ segment, open, onOpenChange }: SegmentServiceItemsDialogProps) {
  const serviceItems = segment?.serviceItems ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="rounded-lg border-panel-border bg-panel-surface p-0 sm:p-0">
        <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0 border-b border-panel-border p-6">
          <div className="flex flex-col">
            <DialogTitle className="font-bold text-panel-surface-foreground">Serviços vinculados</DialogTitle>
            <DialogDescription className="text-panel-muted-foreground">
              {segment ? `Itens de serviço cadastrados em "${segment.name}".` : ""}
            </DialogDescription>
          </div>
          <DialogClose className="cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex flex-col gap-2 p-6">
          {serviceItems.length > 0 ? (
            <ul className="flex flex-col divide-y divide-panel-border">
              {serviceItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="text-panel-surface-foreground">{item.name}</span>
                  <span className="text-panel-muted-foreground">{formatCurrency(item.basePrice)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-panel-muted-foreground">
              Nenhum serviço vinculado a este segmento.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
