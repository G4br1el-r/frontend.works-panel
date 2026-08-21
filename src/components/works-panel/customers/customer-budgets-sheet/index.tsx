"use client";

import { ExternalLink, RotateCcw, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type CustomerBudgetSummary,
  toCustomerBudgetSummary,
} from "@/lib/order/budget-row";
import {
  formatBudgetPeriod,
  getStatusClassName,
  getStatusLabel,
} from "@/lib/order/format-budget";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

interface CustomerBudgetsSheetProps {
  customer: CustomerResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function fetchCustomerBudgets(customerId: number) {
  const response = await fetch(
    `/api/works-panel/customer/${customerId}/budgets`,
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Falha ao carregar os orçamentos");
  }

  return (await response.json()) as BudgetResponseType[];
}

function BudgetItem({ budget }: { budget: CustomerBudgetSummary }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-panel-border bg-panel-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-semibold text-panel-surface-foreground text-sm tabular-nums">
            #{budget.id}
          </span>
          <span className="text-panel-muted-foreground text-xs tabular-nums">
            {formatBudgetPeriod(budget.startDate, budget.endDate)}
          </span>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 font-medium text-xs",
            getStatusClassName(budget.status),
          )}
        >
          {getStatusLabel(budget.status)}
        </span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 border-panel-border border-t pt-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-base text-panel-surface-foreground tabular-nums">
            {formatCurrency(budget.clientTotal)}
          </span>
          <span className="text-panel-muted-foreground text-xs tabular-nums">
            {budget.paidInstallmentsCount}/{budget.installmentsCount} parcelas
            pagas · {formatCurrency(budget.paidTotal)}
          </span>
        </div>

        <Link
          href={`/gestao-obras/orcamentos/${budget.id}`}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-panel-border px-2.5 py-1.5 text-panel-muted-foreground text-xs transition-colors hover:bg-panel-page hover:text-panel-surface-foreground"
        >
          <ExternalLink className="size-3.5" />
          Abrir
        </Link>
      </div>
    </li>
  );
}

export function CustomerBudgetsSheet({
  customer,
  open,
  onOpenChange,
}: CustomerBudgetsSheetProps) {
  const [budgets, setBudgets] = useState<CustomerBudgetSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const customerId = customer?.id;

  const load = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCustomerBudgets(id);
      setBudgets(
        data
          .map(toCustomerBudgetSummary)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Não foi possível carregar os orçamentos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Busca sob demanda: carregar isso junto da listagem pesaria a tela toda.
  useEffect(() => {
    if (!open || customerId === undefined) return;

    setBudgets(null);
    load(customerId);
  }, [open, customerId, load]);

  const total = budgets?.reduce((sum, budget) => sum + budget.clientTotal, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-page p-0 sm:max-w-lg!"
      >
        <SheetHeader className="shrink-0 flex-row items-start justify-between gap-3 space-y-0 border-panel-border border-b bg-panel-surface p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1">
            <SheetTitle className="truncate font-bold text-lg text-panel-surface-foreground">
              {customer?.name ?? "Orçamentos"}
            </SheetTitle>
            <SheetDescription className="text-panel-muted-foreground text-xs sm:text-sm">
              {budgets && budgets.length > 0
                ? `${budgets.length} ${budgets.length === 1 ? "orçamento" : "orçamentos"} · ${formatCurrency(total ?? 0)}`
                : "Orçamentos deste cliente."}
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-md p-1 text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
          {isLoading && (
            <>
              {Array.from({ length: 3 }, (_, index) => index).map((index) => (
                <Skeleton key={index} className="h-[124px] rounded-xl" />
              ))}
            </>
          )}

          {!isLoading && error && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-panel-border border-dashed bg-panel-surface p-6 text-center">
              <p className="text-panel-muted-foreground text-sm">{error}</p>
              {customerId !== undefined && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer gap-1.5 border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
                  onClick={() => load(customerId)}
                >
                  <RotateCcw className="size-4" />
                  Tentar novamente
                </Button>
              )}
            </div>
          )}

          {!isLoading && !error && budgets?.length === 0 && (
            <p className="rounded-xl border border-panel-border border-dashed bg-panel-surface p-6 text-center text-panel-muted-foreground text-sm">
              Este cliente ainda não tem orçamentos.
            </p>
          )}

          {!isLoading && !error && budgets && budgets.length > 0 && (
            <ul className="flex flex-col gap-3">
              {budgets.map((budget) => (
                <BudgetItem key={budget.id} budget={budget} />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
