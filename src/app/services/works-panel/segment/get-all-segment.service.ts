import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { api } from "@/lib/api";

interface GetAllSegmentParams {
  active?: boolean;
}

export async function GetAllSegmentService(params?: GetAllSegmentParams) {
  const query = params?.active !== undefined ? `?active=${params.active}` : "";

  return await api.get<SegmentResponseType[]>(`/segment${query}`, {
    cache: "force-cache",
    next: { tags: ["segments"] },
  });
}
