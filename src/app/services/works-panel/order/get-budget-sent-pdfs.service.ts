import type { BudgetSentPdfResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";

/** Histórico de envios ao cliente, mais recente primeiro. */
export async function GetBudgetSentPdfsService(id: number) {
  return await api.get<BudgetSentPdfResponseType[]>(`/budget/${id}/sent-pdf`, {
    cache: "no-store",
    next: { tags: ["budgets", `budget-${id}`] },
  });
}
