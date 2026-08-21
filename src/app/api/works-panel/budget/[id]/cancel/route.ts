import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

/**
 * Cancela um orçamento aprovado. O backend cancela em cascata as parcelas em
 * aberto na mesma transação, então o financeiro também precisa revalidar.
 */
export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const budget = await api.patch<BudgetResponseType>(`/budget/${id}/cancel`);

    revalidateTag("budgets", { expire: 0 });
    revalidateTag(`budget-${id}`, { expire: 0 });
    revalidateTag("installments", { expire: 0 });

    return NextResponse.json(budget);
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
