import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { InstallmentMutationResponseType } from "@/@type/works-panel/installment/get-installment.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const installment = await api.patch<InstallmentMutationResponseType>(
      `/installment/${id}/pay`,
    );

    revalidateTag("installments", { expire: 0 });

    return NextResponse.json(installment);
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
