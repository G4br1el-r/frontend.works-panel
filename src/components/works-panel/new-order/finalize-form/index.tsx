"use client";

import { CheckCircle2, Download, Mail, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import { InputComponent } from "@/components/shared/input-component";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateNewBudget } from "@/hooks/works-panel/order/use-create-new-budget";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { WrapperForm } from "../wrapper-form";

export function FinalizeForm() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const observation = useNewOrderStore((state) => state.observation);
  const setObservation = useNewOrderStore((state) => state.setObservation);
  const editingBudgetId = useNewOrderStore((state) => state.editingBudgetId);
  const { onSubmit, isValid } = useCreateNewBudget();

  const isEditing = editingBudgetId !== null;

  function handleConfirm(channel: "email" | "whatsapp" | "pdf" | "none") {
    setIsConfirmOpen(false);
    onSubmit(channel);
  }

  function handleOpenConfirm() {
    // Na edição o orçamento já existe: salva direto, sem perguntar sobre envio.
    if (!isValid || isEditing) {
      onSubmit("none");
      return;
    }

    setIsConfirmOpen(true);
  }

  return (
    <WrapperForm
      title="Finalizar"
      description="Revise e confirme o orçamento."
      icon="fileText"
    >
      <div className="flex w-full min-w-0 flex-col gap-4">
        <div className="flex w-full min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium text-panel-surface-foreground">
            Observação
          </span>
          <InputComponent.wrapper classNameWrapper="h-auto min-w-0 items-start rounded-lg border border-panel-border bg-panel-surface p-3 focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20">
            <InputComponent.textarea
              id="order-observation"
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              placeHolder="Alguma observação sobre este orçamento? (opcional)"
              className="text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
              rows={3}
            />
          </InputComponent.wrapper>
        </div>

        <Button
          type="button"
          className="w-full cursor-pointer gap-1.5 sm:w-fit"
          onClick={handleOpenConfirm}
        >
          <CheckCircle2 className="size-4" />
          {isEditing ? "Salvar alterações" : "Confirmar orçamento"}
        </Button>
      </div>

      <ConfirmOrderDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleConfirm}
      />
    </WrapperForm>
  );
}

interface ConfirmOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (channel: "email" | "whatsapp" | "pdf" | "none") => void;
}

function ConfirmOrderDialog({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmOrderDialogProps) {
  const SEND_OPTIONS = [
    { key: "email" as const, label: "Enviar por email", icon: Mail },
    {
      key: "whatsapp" as const,
      label: "Enviar por WhatsApp",
      icon: MessageCircle,
    },
    { key: "pdf" as const, label: "Baixar PDF", icon: Download },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-lg border-panel-border bg-panel-surface p-0 sm:p-0"
      >
        <DialogHeader className="flex-row shrink-0 items-start justify-between gap-3 space-y-0 border-b border-panel-border p-4 sm:gap-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1.5">
            <DialogTitle className="font-bold text-panel-surface-foreground">
              Confirmar orçamento
            </DialogTitle>
            <DialogDescription className="text-xs text-panel-muted-foreground sm:text-sm">
              O orçamento será confirmado. Se quiser, envie para o cliente
              agora.
            </DialogDescription>
          </div>
          <DialogClose className="shrink-0 cursor-pointer rounded-xs text-panel-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        </DialogHeader>

        <div className="flex min-w-0 flex-col gap-2 overflow-y-auto p-4 sm:p-6">
          {SEND_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onConfirm(option.key)}
              className="flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-lg border border-panel-border bg-panel-surface px-3 py-3 text-left transition-colors hover:border-panel-accent/40 hover:bg-panel-page sm:px-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-panel-page text-panel-surface-foreground">
                <option.icon className="size-4.5" />
              </span>
              <span className="min-w-0 truncate text-sm font-medium text-panel-surface-foreground">
                {option.label}
              </span>
            </button>
          ))}

          <Button
            type="button"
            variant="secondary"
            className="mt-2 w-full cursor-pointer hover:bg-panel-border"
            onClick={() => onConfirm("none")}
          >
            Confirmar sem enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
