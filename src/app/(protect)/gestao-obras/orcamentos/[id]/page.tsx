import { notFound } from "next/navigation";
import { GetBudgetService } from "@/app/services/works-panel/order/get-budget.service";
import { GetBudgetSentPdfsService } from "@/app/services/works-panel/order/get-budget-sent-pdfs.service";
import { FadeIn } from "@/components/motion/fade-in";
import { BudgetDetail } from "@/components/works-panel/order/budget-detail";

interface BudgetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BudgetDetailPage({
  params,
}: BudgetDetailPageProps) {
  const { id } = await params;
  const budgetId = Number(id);

  if (Number.isNaN(budgetId)) notFound();

  const budget = await GetBudgetService(budgetId).catch(() => null);

  if (!budget) notFound();

  const sentPdfs = await GetBudgetSentPdfsService(budgetId).catch(() => []);

  return (
    <main className="flex w-full min-w-0 flex-col gap-4 pb-10 sm:gap-6">
      <FadeIn direction="up" distance={12} onMount className="w-full min-w-0">
        <BudgetDetail budget={budget} sentPdfs={sentPdfs} />
      </FadeIn>
    </main>
  );
}
