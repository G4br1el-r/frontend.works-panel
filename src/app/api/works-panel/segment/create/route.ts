import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { segmentSchema } from "@/schema/works-panel/segment/create-new-segment";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = segmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const segment = await api.post<SegmentResponseType>(
      "/segment",
      parsed.data,
    );

    revalidateTag("segments", { expire: 0 });

    return NextResponse.json(segment, { status: 201 });
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
