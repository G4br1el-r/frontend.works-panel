import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { EmployeerResponseData } from "@/@type/works-panel/employeer/get-employeer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createEmployeerPayloadSchema } from "@/schema/works-panel/employeer/create-new-employeer";

const editEmployeerPayloadSchema = createEmployeerPayloadSchema.extend({
  id: z.number(),
});

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = editEmployeerPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const employeer = await api.put<EmployeerResponseData>(
      `/employeer/${id}`,
      payload,
    );

    revalidateTag("employeers", "max");

    return NextResponse.json(employeer, { status: 200 });
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
