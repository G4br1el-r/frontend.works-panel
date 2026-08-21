"use client";

import {
  Ban,
  Copy,
  Eye,
  FilePlus2,
  HardHat,
  MoreHorizontal,
  Package,
  Wrench,
} from "lucide-react";
import { motion } from "motion/react";
import type { BudgetStatus } from "@/@type/works-panel/order/get-budget.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BudgetRow } from "@/lib/order/budget-row";
import {
  formatBudgetDate,
  formatBudgetPeriod,
  getStatusClassName,
  getStatusLabel,
  isBudgetCancelable,
  PAYMENT_TYPE_LABEL,
} from "@/lib/order/format-budget";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { getInitials } from "@/lib/utils/get-initials";

interface BudgetMobileCardProps {
  budget: BudgetRow;
  onView?: (row: BudgetRow) => void;
  onCreateFromOrder?: (row: BudgetRow) => void;
  onDuplicate?: (row: BudgetRow) => void;
  onCancel?: (row: BudgetRow) => void;
}

export function BudgetMobileCard({
  budget,
  onView,
  onCreateFromOrder,
  onDuplicate,
  onCancel,
}: BudgetMobileCardProps) {
  const isFromSite = budget.origin === "SITE";
  const cancelable = isBudgetCancelable(budget.status as BudgetStatus);
  const period =
    budget.startDate && budget.endDate
      ? formatBudgetPeriod(budget.startDate, budget.endDate)
      : null;

  return (
    <motion.div
      layout
      className="flex flex-col gap-3 rounded-xl border border-panel-border bg-panel-surface p-4"
    >
      {/* Identidade: avatar + cliente + nº do orçamento */}
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-panel-accent-light font-bold text-panel-accent text-sm ring-4 ring-panel-accent-light/40">
          {getInitials(budget.customerName)}
        </span>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-semibold text-base text-panel-surface-foreground">
            {budget.customerName}
          </span>
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-panel-muted-foreground text-sm">
            <span className="tabular-nums">
              {isFromSite ? `Pedido #${budget.id}` : `#${budget.id}`}
            </span>
            <span aria-hidden>·</span>
            <span>{isFromSite ? "Do site" : "Do painel"}</span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mr-1 -mt-1 shrink-0 cursor-pointer text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
            >
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Ações do orçamento #{budget.id}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {isFromSite ? (
              <DropdownMenuItem onSelect={() => onCreateFromOrder?.(budget)}>
                <FilePlus2 />
                Montar orçamento
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem onSelect={() => onView?.(budget)}>
                  <Eye />
                  Abrir orçamento
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => onDuplicate?.(budget)}>
                  <Copy />
                  Duplicar
                </DropdownMenuItem>
                {cancelable && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => onCancel?.(budget)}
                    >
                      <Ban />
                      Cancelar orçamento
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Valor em destaque + situação */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-panel-border border-t pt-3">
        {budget.clientTotal !== null ? (
          <div className="flex min-w-0 flex-col gap-0.5">
            <strong className="font-bold text-lg text-panel-surface-foreground tabular-nums">
              {formatCurrency(budget.clientTotal)}
            </strong>
            {budget.paymentType && budget.installmentsCount ? (
              <span className="text-panel-muted-foreground text-sm">
                {PAYMENT_TYPE_LABEL[budget.paymentType]} ·{" "}
                {budget.installmentsCount}x
              </span>
            ) : null}
          </div>
        ) : (
          <span className="text-panel-muted-foreground text-sm">
            Pedido sem orçamento montado
          </span>
        )}

        <span
          className={cn(
            "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 font-medium text-xs",
            getStatusClassName(budget.status),
          )}
        >
          {getStatusLabel(budget.status)}
        </span>
      </div>

      {/* Contexto secundário */}
      <dl className="flex flex-col gap-2 text-sm">
        {budget.addressLabel && (
          <div className="flex items-start justify-between gap-3">
            <dt className="shrink-0 text-panel-muted-foreground">Endereço</dt>
            <dd className="min-w-0 truncate text-right text-panel-surface-foreground">
              {budget.addressLabel}
            </dd>
          </div>
        )}

        {period && (
          <div className="flex items-center justify-between gap-3">
            <dt className="text-panel-muted-foreground">Período</dt>
            <dd className="whitespace-nowrap text-panel-surface-foreground tabular-nums">
              {period}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <dt className="text-panel-muted-foreground">Itens</dt>
          <dd className="flex flex-wrap items-center justify-end gap-1.5">
            <TooltipComponent content="Serviços" disableHoverableContent>
              <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 font-medium text-panel-surface-foreground text-xs tabular-nums">
                <Wrench className="size-3" />
                {budget.servicesCount}
              </span>
            </TooltipComponent>

            {budget.materialsCount !== null && (
              <TooltipComponent content="Materiais" disableHoverableContent>
                <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 font-medium text-panel-surface-foreground text-xs tabular-nums">
                  <Package className="size-3" />
                  {budget.materialsCount}
                </span>
              </TooltipComponent>
            )}

            {budget.employeersCount !== null && (
              <TooltipComponent content="Funcionários" disableHoverableContent>
                <span className="inline-flex items-center gap-1 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 font-medium text-panel-surface-foreground text-xs tabular-nums">
                  <HardHat className="size-3" />
                  {budget.employeersCount}
                </span>
              </TooltipComponent>
            )}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-panel-muted-foreground">Criado em</dt>
          <dd className="whitespace-nowrap text-panel-muted-foreground tabular-nums">
            {formatBudgetDate(budget.createdAt)}
          </dd>
        </div>
      </dl>
    </motion.div>
  );
}
