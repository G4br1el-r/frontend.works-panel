import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { EmployeerResponseData } from "@/@type/works-panel/employeer/get-employeer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createEmployeerPayloadSchema } from "@/schema/works-panel/employeer/create-new-employeer";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createEmployeerPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos", issues: z.flattenError(parsed.error) }, { status: 400 });
  }

  try {
    const employeer = await api.post<EmployeerResponseData>("/employeer", parsed.data);

    revalidateTag("employeers", "max");

    return NextResponse.json(employeer, { status: 201 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json({ message: error.message, code: error.code }, { status: error.statusCode });
    }
    throw error;
  }
}
