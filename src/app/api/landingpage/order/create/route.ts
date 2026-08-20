import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createOrderPayloadSchema } from "@/schema/landingpage/cart/create-order-payload-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createOrderPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const order = await api.post("/order", parsed.data);

    revalidateTag("orders", { expire: 0 });

    return NextResponse.json(order, { status: 201 });
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
