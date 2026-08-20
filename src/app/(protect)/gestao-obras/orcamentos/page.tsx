import { Plus } from "lucide-react";
import Link from "next/link";
import { GetAllBudgetService } from "@/app/services/works-panel/order/get-all-budget.service";
import { GetAllOrderService } from "@/app/services/works-panel/order/get-all-order.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { buttonVariants } from "@/components/ui/button";
import { BudgetsTable } from "@/components/works-panel/order/budgets-table";
import { cn } from "@/lib/utils/cn";

export const dynamic = "force-dynamic";

export default async function Orders() {
  const [budgets, orders] = await Promise.all([
    GetAllBudgetService(),
    GetAllOrderService(),
  ]);

  const isEmpty = budgets.length === 0 && orders.length === 0;

  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <TitleSection
          title="Orçamentos"
          subtitle="Acompanhe os orçamentos do painel e as solicitações vindas do site."
        />
        <Link
          href="/gestao-obras/orcamentos/novo"
          className={cn(
            buttonVariants(),
            "h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto",
          )}
        >
          <Plus className="size-4" />
          Novo orçamento
        </Link>
      </FadeIn>

      {isEmpty ? (
        <EmptyState
          icon="fileText"
          title="Nenhum orçamento ainda"
          subtitle="Crie um orçamento no painel ou aguarde uma solicitação pelo site."
        />
      ) : (
        <BudgetsTable budgets={budgets} orders={orders} />
      )}
    </main>
  );
}
