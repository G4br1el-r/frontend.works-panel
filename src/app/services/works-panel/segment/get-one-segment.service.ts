import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { api } from "@/lib/api";

export async function GetOneSegmentService(id: number) {
  return await api.get<SegmentResponseType>(`/segment/${id}`, {
    cache: "force-cache",
    next: { tags: ["segments"] },
  });
}
