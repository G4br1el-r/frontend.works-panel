import type { BudgetDetailType } from "@/@type/works-panel/installment/get-installment.type";
import { GetAllInstallmentService } from "@/app/services/works-panel/installment/get-all-installment.service";
import { GetAllBudgetService } from "@/app/services/works-panel/order/get-all-budget.service";
import { GetBudgetSentPdfsService } from "@/app/services/works-panel/order/get-budget-sent-pdfs.service";
import { FadeIn } from "@/components/motion/fade-in";
import { EmptyState } from "@/components/shared/empty-state";
import { TitleSection } from "@/components/shared/title-section";
import { InstallmentsTable } from "@/components/works-panel/installment/installments-table";
import { SummaryCards } from "@/components/works-panel/installment/summary-cards";
import {
  buildDocumentByCustomerId,
  buildInstallmentSummary,
  toBudgetDetail,
  toInstallmentRows,
} from "@/lib/utils/installment";

export const dynamic = "force-dynamic";

export default async function Financeiro() {
  // Aprovados e cancelados: o financeiro mostra o que foi cancelado, não esconde.
  const [installments, approvedBudgets, canceledBudgets] = await Promise.all([
    GetAllInstallmentService(),
    GetAllBudgetService({ status: "APPROVED" }),
    // Tolera backend sem o status CANCELED ainda migrado: sem os cancelados a
    // tela ainda serve, derrubá-la inteira não.
    GetAllBudgetService({ status: "CANCELED" }).catch(() => []),
  ]);
  const budgets = [...approvedBudgets, ...canceledBudgets];

  // Só busca o histórico de envios dos orçamentos que têm parcela na tela.
  const budgetIdsWithInstallments = new Set(
    installments.map((installment) => installment.budget.id),
  );
  const relevantBudgets = budgets.filter((budget) =>
    budgetIdsWithInstallments.has(budget.id),
  );

  const sentPdfsByBudget = await Promise.all(
    relevantBudgets.map(async (budget) => ({
      budgetId: budget.id,
      sentPdfs: await GetBudgetSentPdfsService(budget.id).catch(() => []),
    })),
  );
  const sentPdfsMap = new Map(
    sentPdfsByBudget.map(({ budgetId, sentPdfs }) => [budgetId, sentPdfs]),
  );

  const canceledBudgetIds = new Set(canceledBudgets.map((budget) => budget.id));

  const rows = toInstallmentRows(
    installments,
    buildDocumentByCustomerId(budgets),
    canceledBudgetIds,
  );
  const summary = buildInstallmentSummary(rows);

  const budgetDetails: Record<number, BudgetDetailType> = Object.fromEntries(
    relevantBudgets.map((budget) => [
      budget.id,
      toBudgetDetail(budget, sentPdfsMap.get(budget.id) ?? []),
    ]),
  );

  const isEmpty = rows.length === 0;

  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <FadeIn
        direction="up"
        distance={12}
        onMount
        className="flex flex-col items-start gap-4"
      >
        <TitleSection
          title="Financeiro"
          subtitle="Parcelas geradas pelos orçamentos aprovados. Dar baixa marca a parcela como recebida."
        />
      </FadeIn>

      {isEmpty ? (
        <EmptyState
          icon="wallet"
          title="Nenhuma parcela ainda"
          subtitle="As parcelas aparecem aqui assim que um orçamento for aprovado."
        />
      ) : (
        <>
          <SummaryCards summary={summary} />
          <InstallmentsTable
            installments={rows}
            budgetDetails={budgetDetails}
          />
        </>
      )}
    </main>
  );
}
