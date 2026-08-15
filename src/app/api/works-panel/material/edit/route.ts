import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createMaterialPayloadSchema } from "@/schema/works-panel/material/create-new-material";

const editMaterialPayloadSchema = createMaterialPayloadSchema.extend({
  id: z.number(),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = editMaterialPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const material = await api.patch<MaterialResponseType>(
      `/material/${id}`,
      payload,
    );

    revalidateTag("materials", { expire: 0 });
    revalidateTag("service-items", { expire: 0 });

    return NextResponse.json(material, { status: 200 });
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
