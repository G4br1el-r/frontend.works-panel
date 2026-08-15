import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { api } from "@/lib/api";

export async function GetAllMeasureService() {
  return await api.get<MeasureResponseType[]>("/measure", {
    cache: "force-cache",
    next: { tags: ["measures"] },
  });
}
