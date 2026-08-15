import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { addressRegisterSchema } from "@/schema/landingpage/cart/address-register-schema";

interface AddressRouteParams {
  params: Promise<{ id: string; addressId: string }>;
}

export async function PATCH(request: Request, { params }: AddressRouteParams) {
  const { id, addressId } = await params;
  const body = await request.json();
  const parsed = addressRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const address = await api.patch<AddressResponseType>(
      `/customer/${id}/address/${addressId}`,
      parsed.data,
    );

    revalidateTag("customers", { expire: 0 });

    return NextResponse.json(address, { status: 200 });
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

export async function DELETE(
  _request: Request,
  { params }: AddressRouteParams,
) {
  const { id, addressId } = await params;

  try {
    await api.delete(`/customer/${id}/address/${addressId}`);

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
