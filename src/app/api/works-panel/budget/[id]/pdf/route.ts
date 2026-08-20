import { NextResponse } from "next/server";
import { requireEnv } from "@/lib/utils/require-env";

/**
 * Repassa o PDF do backend. O corpo é binário: não pode passar pelo api-client,
 * que sempre parseia como JSON.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const response = await fetch(`${requireEnv("API_URL")}/budget/${id}/pdf`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível gerar o PDF do orçamento." },
      { status: response.status },
    );
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="orcamento-${id}.pdf"`,
    },
  });
}
