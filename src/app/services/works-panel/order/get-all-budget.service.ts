import type {
  BudgetResponseType,
  BudgetStatus,
} from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";

interface GetAllBudgetParams {
  status?: BudgetStatus;
  customerId?: number;
}

export async function GetAllBudgetService(params?: GetAllBudgetParams) {
  const query = new URLSearchParams();

  if (params?.status) query.set("status", params.status);
  if (params?.customerId) query.set("customerId", String(params.customerId));

  const search = query.size > 0 ? `?${query.toString()}` : "";

  return await api.get<BudgetResponseType[]>(`/budget${search}`, {
    cache: "no-store",
    next: { tags: ["budgets"] },
  });
}
