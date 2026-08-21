import type {
  DashboardDataType,
  DashboardFilters,
} from "@/@type/works-panel/dashboard/get-dashboard.type";
import { api } from "@/lib/api";

/**
 * O backend usa `forbidNonWhitelisted`: qualquer param fora de
 * `from`/`to`/`customerIds` derruba a requisição com 400.
 */
export async function GetDashboardService(filters?: Partial<DashboardFilters>) {
  const query = new URLSearchParams();

  if (filters?.range?.from) query.set("from", filters.range.from);
  if (filters?.range?.to) query.set("to", filters.range.to);
  if (filters?.customerIds?.length) {
    query.set("customerIds", filters.customerIds.join(","));
  }

  const search = query.size > 0 ? `?${query.toString()}` : "";

  return await api.get<DashboardDataType>(`/dashboard${search}`, {
    cache: "no-store",
    next: { tags: ["dashboard"] },
  });
}
