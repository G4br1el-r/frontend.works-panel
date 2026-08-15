import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { addressRegisterSchema } from "@/schema/landingpage/cart/address-register-schema";

interface CreateAddressRouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: Request,
  { params }: CreateAddressRouteParams,
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = addressRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const address = await api.post<AddressResponseType>(
      `/customer/${id}/address`,
      parsed.data,
    );

    revalidateTag("customers", { expire: 0 });

    return NextResponse.json(address, { status: 201 });
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
