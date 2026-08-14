import { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { api } from "@/lib/api";

export async function GetAllSegmentService() {
  return await api.get<SegmentResponseType[]>("/segment", { next: { tags: ["segments"] } });
}
