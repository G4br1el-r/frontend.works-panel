import { notFound } from "next/navigation";
import { GetOneSegmentService } from "@/app/services/works-panel/segment/get-one-segment.service";
import { isAppError } from "@/lib/api-client";

export async function getSegmentOrNotFound(id: string) {
  const segmentId = Number(id);
  if (!Number.isInteger(segmentId) || segmentId <= 0) notFound();

  try {
    const segment = await GetOneSegmentService(segmentId);

    if (!segment.active) notFound();

    return segment;
  } catch (error) {
    if (isAppError(error) && error.statusCode === 404) notFound();
    throw error;
  }
}
