import { NextResponse } from "next/server";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

interface LookupCustomerRouteParams {
  params: Promise<{ document: string }>;
}

export async function GET(
  _request: Request,
  { params }: LookupCustomerRouteParams,
) {
  const { document } = await params;
  const digits = document.replace(/\D/g, "");

  try {
    const customer = await api.get<CustomerResponseType>(
      `/customer/document/${digits}`,
    );

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
