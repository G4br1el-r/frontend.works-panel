import { NextResponse } from "next/server";
import { requireEnv } from "@/lib/utils/require-env";

/**
 * Repassa um PDF já enviado ao cliente. Como o do orçamento atual, o corpo é
 * binário e não pode passar pelo api-client, que sempre parseia como JSON.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const version = new URL(request.url).searchParams.get("version");
  const query = version ? `?version=${version}` : "";

  const response = await fetch(
    `${requireEnv("API_URL")}/budget/${id}/sent-pdf/download${query}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "Não foi possível baixar o PDF enviado." },
      { status: response.status },
    );
  }

  const fileName = version
    ? `orcamento-${id}-v${version}.pdf`
    : `orcamento-${id}.pdf`;

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
