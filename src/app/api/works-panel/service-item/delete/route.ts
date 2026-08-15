import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

const deleteServiceItemSchema = z.object({
  id: z.number(),
});

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = deleteServiceItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos", issues: z.flattenError(parsed.error) }, { status: 400 });
  }

  try {
    await api.delete(`/service-item/${parsed.data.id}`);

    revalidateTag("service-items", { expire: 0 });
    revalidateTag("segments", { expire: 0 });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json({ message: error.message, code: error.code }, { status: error.statusCode });
    }
    throw error;
  }
}
