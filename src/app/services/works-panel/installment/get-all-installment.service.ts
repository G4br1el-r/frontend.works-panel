import type { InstallmentResponseType } from "@/@type/works-panel/installment/get-installment.type";
import { api } from "@/lib/api";

interface GetAllInstallmentParams {
  customerId?: number;
  budgetId?: number;
}

export async function GetAllInstallmentService(
  params?: GetAllInstallmentParams,
) {
  const query = new URLSearchParams();

  if (params?.customerId) query.set("customerId", String(params.customerId));
  if (params?.budgetId) query.set("budgetId", String(params.budgetId));

  const search = query.size > 0 ? `?${query.toString()}` : "";

  return await api.get<InstallmentResponseType[]>(`/installment${search}`, {
    cache: "no-store",
    next: { tags: ["installments"] },
  });
}
