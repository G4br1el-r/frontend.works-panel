import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createServiceItemPayloadSchema } from "@/schema/works-panel/service-item/create-new-service-item";

const editServiceItemPayloadSchema = createServiceItemPayloadSchema.extend({
  id: z.number(),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = editServiceItemPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const serviceItem = await api.patch<ServiceItemResponseType>(
      `/service-item/${id}`,
      payload,
    );

    revalidateTag("service-items", { expire: 0 });
    revalidateTag("segments", { expire: 0 });

    return NextResponse.json(serviceItem, { status: 200 });
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
