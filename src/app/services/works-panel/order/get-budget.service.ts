import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";

export async function GetBudgetService(id: number) {
  return await api.get<BudgetResponseType>(`/budget/${id}`, {
    cache: "no-store",
    next: { tags: ["budgets", `budget-${id}`] },
  });
}
