import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { BudgetResponseType } from "@/@type/works-panel/order/get-budget.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

const updateStatusSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "APPROVED", "REJECTED"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const parsed = updateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Situação inválida", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    const budget = await api.patch<BudgetResponseType>(
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
