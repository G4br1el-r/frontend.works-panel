import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createMaterialPayloadSchema } from "@/schema/works-panel/material/create-new-material";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createMaterialPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const material = await api.post<MaterialResponseType>(
      "/material",
      parsed.data,
    );

    revalidateTag("materials", { expire: 0 });
    revalidateTag("service-items", { expire: 0 });

    return NextResponse.json(material, { status: 201 });
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
