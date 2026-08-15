import { NextResponse } from "next/server";
import type { CepResponseType } from "@/@type/works-panel/cep/get-cep.type";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

interface LookupCepRouteParams {
  params: Promise<{ cep: string }>;
}

export async function GET(_request: Request, { params }: LookupCepRouteParams) {
  const { cep } = await params;
  const digits = cep.replace(/\D/g, "");

  try {
    const address = await api.get<CepResponseType>(`/cep/${digits}`);

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
