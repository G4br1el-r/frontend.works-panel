"use client";

import { FileText, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type { BudgetSentPdfResponseType } from "@/@type/works-panel/order/get-budget.type";
import { Button } from "@/components/ui/button";
import { downloadBudgetPdf } from "@/lib/order/download-budget-pdf";

class SendBudgetError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function sendBudgetEmail(budgetId: number) {
  const response = await fetch(`/api/works-panel/budget/${budgetId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channels: ["email"] }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new SendBudgetError(
      body?.message ?? "Falha ao enviar o orçamento",
      body?.code,
    );
  }

  return await response.json();
}

interface BudgetPdfActionsProps {
  budgetId: number;
  customerEmail: string | null;
  sentPdfs: BudgetSentPdfResponseType[];
}

export function BudgetPdfActions({
  budgetId,
  customerEmail,
  sentPdfs,
}: BudgetPdfActionsProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const hasBeenSent = sentPdfs.length > 0;

  async function handleDownloadCurrent() {
    setIsPending(true);
    try {
      await toast.promise(downloadBudgetPdf(budgetId), {
        loading: "Gerando o PDF...",
        success: "PDF baixado.",
        error: "Não foi possível gerar o PDF.",
      });
    } catch {
      // O toast.promise já notificou.
    } finally {
      setIsPending(false);
    }
  }

  async function handleSend() {
    if (!customerEmail) {
      toast.error("O cliente não tem e-mail cadastrado.", {
        id: "budget-send-error",
      });
      return;
    }

    setIsPending(true);
    try {
      await toast.promise(sendBudgetEmail(budgetId), {
        loading: `Enviando orçamento para ${customerEmail}...`,
        success: "Orçamento enviado por e-mail.",
        error: (error) =>
          error instanceof SendBudgetError
            ? error.message
            : "Não foi possível enviar o orçamento.",
      });
      router.refresh();
    } catch {
      // O toast.promise já notificou.
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        className="cursor-pointer gap-1.5 hover:bg-panel-border"
        disabled={isPending}
        onClick={handleDownloadCurrent}
      >
        <FileText className="size-4" />
        Baixar PDF
      </Button>

      <Button
        type="button"
        variant="secondary"
        className="cursor-pointer gap-1.5 hover:bg-panel-border"
        disabled={isPending}
        onClick={handleSend}
      >
        <Send className="size-4" />
        {hasBeenSent ? "Reenviar orçamento" : "Enviar orçamento"}
      </Button>
    </div>
  );
}
