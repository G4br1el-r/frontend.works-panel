import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { customerCreatePayloadSchema } from "@/schema/landingpage/cart/customer-create-payload-schema";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = customerCreatePayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const created = await api.post<CustomerResponseType>(
      "/customer",
      parsed.data,
    );

    const customer = await api.get<CustomerResponseType>(
      `/customer/${created.id}`,
    );

    revalidateTag("customers", { expire: 0 });

    return NextResponse.json(customer, { status: 201 });
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
