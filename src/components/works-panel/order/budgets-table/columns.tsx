"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Copy,
  Eye,
  FilePlus2,
  Globe,
  HardHat,
  Package,
  Wrench,
} from "lucide-react";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import type { BudgetRow } from "@/lib/order/budget-row";
import {
  formatBudgetDate,
  formatBudgetPeriod,
  getStatusClassName,
  getStatusLabel,
  PAYMENT_TYPE_LABEL,
} from "@/lib/order/format-budget";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface CreateBudgetsColumnsOptions {
  onView?: (row: BudgetRow) => void;
  onCreateFromOrder?: (row: BudgetRow) => void;
  onDuplicate?: (row: BudgetRow) => void;
}

/** Traço para o que a origem não tem — pedido do site não tem obra planejada. */
const EMPTY = <span className="text-panel-muted-foreground">—</span>;

export function createBudgetsColumns({
  onView,
  onCreateFromOrder,
  onDuplicate,
}: CreateBudgetsColumnsOptions): ColumnDef<BudgetRow>[] {
  return [
    {
      accessorKey: "origin",
      header: "Origem",
      cell: ({ row }) =>
        row.original.origin === "SITE" ? (
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-panel-accent/30 bg-panel-accent-light px-2 py-0.5 text-xs font-medium text-panel-accent">
            <Globe className="size-3" />
            Site
          </span>
        ) : (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
            Painel
          </span>
        ),
    },
    {
      accessorKey: "customerName",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-medium text-panel-surface-foreground">
            {row.original.customerName}
          </span>
          <span className="truncate text-xs text-panel-muted-foreground">
            {row.original.addressLabel ?? "Sem endereço"}
          </span>
        </div>
      ),
    },
    {
      id: "period",
      accessorFn: (row) => row.startDate ?? "",
      header: "Período",
      cell: ({ row }) =>
        row.original.startDate && row.original.endDate ? (
          <span className="whitespace-nowrap text-panel-surface-foreground">
            {formatBudgetPeriod(row.original.startDate, row.original.endDate)}
          </span>
        ) : (
          EMPTY
        ),
    },
    {
      id: "items",
      header: "Itens",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <TooltipComponent content="Serviços">
            <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
              <Wrench className="size-3" />
              {row.original.servicesCount}
            </span>
          </TooltipComponent>

          {row.original.materialsCount !== null && (
            <TooltipComponent content="Materiais">
              <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
                <Package className="size-3" />
                {row.original.materialsCount}
              </span>
            </TooltipComponent>
          )}

          {row.original.employeersCount !== null && (
            <TooltipComponent content="Funcionários">
              <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
                <HardHat className="size-3" />
                {row.original.employeersCount}
              </span>
            </TooltipComponent>
          )}
        </div>
      ),
    },
    {
      id: "clientTotal",
      accessorFn: (row) => row.clientTotal ?? 0,
      header: "Valor",
      cell: ({ row }) =>
        row.original.clientTotal === null ? (
          EMPTY
        ) : (
          <div className="flex min-w-0 flex-col items-end">
            <span className="whitespace-nowrap font-mono font-semibold tabular-nums text-panel-surface-foreground">
              {formatCurrency(row.original.clientTotal)}
            </span>
            <span className="whitespace-nowrap text-xs text-panel-muted-foreground">
              margem {row.original.profitMargin}%
            </span>
          </div>
        ),
    },
    {
      id: "payment",
      accessorFn: (row) => row.paymentType ?? "",
      header: "Pagamento",
      cell: ({ row }) =>
        row.original.paymentType ? (
          <div className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap text-panel-surface-foreground">
              {PAYMENT_TYPE_LABEL[row.original.paymentType]}
            </span>
            <span className="whitespace-nowrap text-xs text-panel-muted-foreground">
              {row.original.installmentsCount}{" "}
              {row.original.installmentsCount === 1 ? "parcela" : "parcelas"}
            </span>
          </div>
        ) : (
          EMPTY
        ),
    },
    {
      accessorKey: "status",
      header: "Situação",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
            getStatusClassName(row.original.status),
          )}
        >
          {getStatusLabel(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-panel-muted-foreground">
          {formatBudgetDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          {row.original.origin === "SITE" ? (
            <TooltipComponent content="Montar orçamento a partir deste pedido">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="cursor-pointer text-panel-muted-foreground hover:text-panel-accent"
                onClick={() => onCreateFromOrder?.(row.original)}
              >
                <FilePlus2 className="size-4" />
                <span className="sr-only">Criar orçamento</span>
              </Button>
            </TooltipComponent>
          ) : (
            <>
              <TooltipComponent content="Duplicar como novo orçamento">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-panel-muted-foreground hover:text-panel-accent"
                  onClick={() => onDuplicate?.(row.original)}
                >
                  <Copy className="size-4" />
                  <span className="sr-only">Duplicar orçamento</span>
                </Button>
              </TooltipComponent>

              <TooltipComponent content="Abrir orçamento">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="cursor-pointer text-panel-muted-foreground hover:text-panel-accent"
                  onClick={() => onView?.(row.original)}
                >
                  <Eye className="size-4" />
                  <span className="sr-only">Abrir orçamento</span>
                </Button>
              </TooltipComponent>
            </>
          )}
        </div>
      ),
    },
  ];
}
