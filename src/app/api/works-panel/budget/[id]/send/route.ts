import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { BudgetSendResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

/**
 * Gera o PDF, arquiva como comprovante e marca o orçamento como enviado —
 * tudo numa chamada. Cada envio cria uma versão nova, sem sobrescrever.
 * Com `channels: ["email"]`, também dispara o e-mail ao cliente.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json().catch(() => undefined);

  try {
    const result = await api.post<BudgetSendResponseType>(
      `/budget/${id}/send`,
      body,
    );

    revalidateTag("budgets", { expire: 0 });
    revalidateTag(`budget-${id}`, { expire: 0 });

    return NextResponse.json(result);
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
