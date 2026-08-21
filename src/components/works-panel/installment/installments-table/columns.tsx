"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Ban, CheckCircle2, Eye, Undo2 } from "lucide-react";
import type {
  InstallmentRowType,
  InstallmentSituation,
} from "@/@type/works-panel/installment/get-installment.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDueDate } from "@/lib/utils/installment";

const SITUATION_LABEL: Record<InstallmentSituation, string> = {
  PAID: "Pago",
  CANCELED: "Cancelado",
  OVERDUE: "Atrasado",
  PENDING: "Pendente",
};

const SITUATION_CLASS: Record<InstallmentSituation, string> = {
  PAID: "bg-status-success-bg text-status-success",
  CANCELED: "bg-panel-muted text-panel-muted-foreground",
  OVERDUE: "bg-status-danger-bg text-status-danger",
  PENDING: "bg-status-warning-bg text-status-warning",
};

const SITUATION_DOT_CLASS: Record<InstallmentSituation, string> = {
  PAID: "bg-status-success",
  CANCELED: "bg-panel-muted-foreground",
  OVERDUE: "bg-status-danger",
  PENDING: "bg-status-warning",
};

interface CreateInstallmentsColumnsOptions {
  onPay?: (installment: InstallmentRowType) => void;
  onUnpay?: (installment: InstallmentRowType) => void;
  onViewDetails?: (installment: InstallmentRowType) => void;
  pendingId?: number | null;
}

export function createInstallmentsColumns({
  onPay,
  onUnpay,
  onViewDetails,
  pendingId,
}: CreateInstallmentsColumnsOptions): ColumnDef<InstallmentRowType>[] {
  return [
    {
      id: "customerName",
      accessorFn: (installment) => installment.customerName,
      header: "Cliente",
      cell: ({ row }) => (
        <span
          className={cn(
            "font-medium",
            row.original.situation === "CANCELED"
              ? "text-panel-muted-foreground"
              : "text-panel-surface-foreground",
          )}
        >
          {row.original.customerName}
        </span>
      ),
    },
    {
      id: "budget",
      accessorFn: (installment) => installment.budgetId,
      header: "Orçamento",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "text-panel-muted-foreground",
              row.original.isBudgetCanceled && "line-through",
            )}
          >
            #{row.original.budgetId} · parcela {row.original.number}/
            {row.original.totalInstallments}
          </span>
          {row.original.isBudgetCanceled && (
            <TooltipComponent
              content="Orçamento cancelado — esta parcela pertence a um orçamento que foi cancelado"
              disableHoverableContent
            >
              <span className="inline-flex shrink-0 cursor-default items-center text-status-danger/70 transition-colors hover:text-status-danger">
                <Ban className="size-3.5" />
                <span className="sr-only">Orçamento cancelado</span>
              </span>
            </TooltipComponent>
          )}
        </span>
      ),
    },
    {
      id: "dueDate",
      accessorFn: (installment) => installment.dueDate,
      header: "Vencimento",
      cell: ({ row }) => (
        <span
          className={cn(
            "tabular-nums",
            row.original.situation === "CANCELED"
              ? "text-panel-muted-foreground"
              : "text-panel-surface-foreground",
          )}
        >
          {formatDueDate(row.original.dueDate)}
        </span>
      ),
    },
    {
      id: "amount",
      accessorFn: (installment) => installment.amount,
      header: "Valor",
      cell: ({ row, getValue }) => (
        <span
          className={cn(
            "font-medium tabular-nums",
            row.original.situation === "CANCELED"
              ? "text-panel-muted-foreground line-through"
              : "text-panel-surface-foreground",
          )}
        >
          {formatCurrency(getValue<number>())}
        </span>
      ),
    },
    {
      id: "situation",
      accessorFn: (installment) => installment.situation,
      header: "Situação",
      cell: ({ row }) => {
        const { situation } = row.original;

        return (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-medium text-xs",
              SITUATION_CLASS[situation],
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                SITUATION_DOT_CLASS[situation],
              )}
            />
            {SITUATION_LABEL[situation]}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      enableSorting: false,
      meta: { align: "center" },
      cell: ({ row }) => {
        const installment = row.original;
        const isPending = pendingId === installment.id;
        const isPaid = installment.situation === "PAID";
        // Orçamento cancelado congela a parcela: desfazer a baixa criaria uma
        // pendência num orçamento que não existe mais.
        const isFrozen =
          installment.situation === "CANCELED" || installment.isBudgetCanceled;
        const label = `parcela ${installment.number}/${installment.totalInstallments} de ${installment.customerName}`;

        return (
          <div className="flex items-center justify-center gap-0.5">
            <TooltipComponent content="Ver detalhes" disableHoverableContent>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
                onClick={() => onViewDetails?.(installment)}
              >
                <Eye className="size-4" />
                <span className="sr-only">Ver detalhes da {label}</span>
              </Button>
            </TooltipComponent>

            {!isFrozen && (
              <TooltipComponent
                content={isPaid ? "Desfazer baixa" : "Dar baixa"}
                disableHoverableContent
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={isPending}
                  className={cn(
                    "cursor-pointer transition-colors",
                    isPaid
                      ? "text-panel-muted-foreground hover:bg-panel-page hover:text-panel-surface-foreground!"
                      : "text-panel-muted-foreground hover:bg-status-success-bg hover:text-status-success!",
                  )}
                  onClick={() =>
                    isPaid ? onUnpay?.(installment) : onPay?.(installment)
                  }
                >
                  {isPaid ? (
                    <Undo2 className="size-4" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  <span className="sr-only">
                    {isPaid
                      ? `Desfazer baixa da ${label}`
                      : `Dar baixa na ${label}`}
                  </span>
                </Button>
              </TooltipComponent>
            )}
          </div>
        );
      },
    },
  ];
}
