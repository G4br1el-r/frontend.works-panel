import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

const deleteCustomerSchema = z.object({
  id: z.number(),
});

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = deleteCustomerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    await api.delete(`/customer/${parsed.data.id}`);

    revalidateTag("customers", { expire: 0 });

    return new NextResponse(null, { status: 204 });
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
