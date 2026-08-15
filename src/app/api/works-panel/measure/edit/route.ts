import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { measureSchema } from "@/schema/works-panel/measure/create-new-measure";

const editMeasurePayloadSchema = measureSchema.extend({
  id: z.number(),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = editMeasurePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const measure = await api.patch<MeasureResponseType>(
      `/measure/${id}`,
      payload,
    );

    revalidateTag("measures", { expire: 0 });
    revalidateTag("materials", { expire: 0 });
    revalidateTag("service-items", { expire: 0 });

    return NextResponse.json(measure, { status: 200 });
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
