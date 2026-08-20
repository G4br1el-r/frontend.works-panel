import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";
import { createBudgetSchema } from "@/schema/works-panel/order/create-budget";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = createBudgetSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const budget = await api.put<BudgetResponseType>(
      `/budget/${id}`,
      parsed.data,
    );

    revalidateTag("budgets", { expire: 0 });
    revalidateTag(`budget-${id}`, { expire: 0 });

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
