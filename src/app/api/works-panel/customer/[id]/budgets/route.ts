import { NextResponse } from "next/server";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

/**
 * Orçamentos de um cliente. Carregado sob demanda pelo sheet — trazer isso
 * junto da listagem de clientes pesaria a tela inteira sem necessidade.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const budgets = await api.get<BudgetResponseType[]>(
      `/budget?customerId=${id}`,
      { cache: "no-store" },
    );

    return NextResponse.json(budgets);
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
