import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { segmentSchema } from "@/schema/works-panel/segment/create-new-segment";

const editSegmentPayloadSchema = segmentSchema.extend({
  id: z.number(),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = editSegmentPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const segment = await api.patch<SegmentResponseType>(
      `/segment/${id}`,
      payload,
    );

    revalidateTag("segments", "max");

    return NextResponse.json(segment, { status: 200 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode },
      );
    }
    throw error;
  }
}
