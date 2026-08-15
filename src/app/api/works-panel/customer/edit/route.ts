import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { editCustomerPayloadSchema } from "@/schema/works-panel/customer/edit-customer";

const editCustomerRequestSchema = editCustomerPayloadSchema.extend({
  id: z.number(),
});

export async function PATCH(request: Request) {
  const body = await request.json();
  const parsed = editCustomerRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  const { id, ...payload } = parsed.data;

  try {
    const customer = await api.patch<CustomerResponseType>(
      `/customer/${id}`,
      payload,
    );

    revalidateTag("customers", { expire: 0 });

    return NextResponse.json(customer, { status: 200 });
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
