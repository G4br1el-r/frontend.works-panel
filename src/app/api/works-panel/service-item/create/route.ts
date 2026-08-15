import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createServiceItemPayloadSchema } from "@/schema/works-panel/service-item/create-new-service-item";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createServiceItemPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const serviceItem = await api.post<ServiceItemResponseType>(
      "/service-item",
      parsed.data,
    );

    revalidateTag("service-items", { expire: 0 });
    revalidateTag("segments", { expire: 0 });

    return NextResponse.json(serviceItem, { status: 201 });
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
