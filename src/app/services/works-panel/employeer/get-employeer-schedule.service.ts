import type { EmployeerScheduleResponseType } from "@/@type/works-panel/employeer/get-employeer-schedule.type";
import { api } from "@/lib/api";

interface GetEmployeerScheduleParams {
  from?: string;
  to?: string;
}

/**
 * O backend usa `forbidNonWhitelisted`: qualquer param além de `from`/`to`
 * derruba a requisição com 400.
 */
export async function GetEmployeerScheduleService(
  id: number,
  params?: GetEmployeerScheduleParams,
) {
  const query = new URLSearchParams();

  if (params?.from) query.set("from", params.from);
  if (params?.to) query.set("to", params.to);

  const search = query.size > 0 ? `?${query.toString()}` : "";

  return await api.get<EmployeerScheduleResponseType>(
    `/employeer/${id}/schedule${search}`,
    { cache: "no-store", next: { tags: ["employeers", `employeer-${id}`] } },
  );
}
