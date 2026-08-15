import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { measureSchema } from "@/schema/works-panel/measure/create-new-measure";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = measureSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const measure = await api.post<MeasureResponseType>(
      "/measure",
      parsed.data,
    );

    revalidateTag("measures", { expire: 0 });
    revalidateTag("materials", { expire: 0 });
    revalidateTag("service-items", { expire: 0 });

    return NextResponse.json(measure, { status: 201 });
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
