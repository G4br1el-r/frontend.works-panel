"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils/format-currency";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

export function HeaderForm() {
  const router = useRouter();
  const editingBudgetId = useNewOrderStore((state) => state.editingBudgetId);
  const sourceOrderId = useNewOrderStore((state) => state.sourceOrderId);
  const clientTotal = useNewOrderStore(
    (state) => state.getPricingSummary().clientTotal,
  );

  const title = editingBudgetId
    ? `Editar orçamento #${editingBudgetId}`
    : "Novo orçamento";

  const subtitle = editingBudgetId
    ? "Ajuste os itens e salve as alterações."
    : sourceOrderId
      ? `A partir do pedido #${sourceOrderId} recebido pelo site.`
      : "Escolha os serviços que farão parte deste orçamento.";

  return (
    <div className="flex w-full min-w-0 items-start justify-between gap-2 sm:gap-3">
      <div className="flex min-w-0 items-start gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => router.push("/gestao-obras/orcamentos")}
          className="mt-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:border-panel-accent hover:text-panel-accent"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Voltar</span>
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-lg text-panel-surface-foreground sm:text-2xl">
            {title}
          </h1>
          <p className="mt-0.5 text-xs text-panel-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        </div>
      </div>

      <span className="shrink-0 text-right font-mono text-sm font-bold text-panel-surface-foreground tabular-nums sm:text-base">
        {formatCurrency(clientTotal)}
      </span>
    </div>
  );
}
