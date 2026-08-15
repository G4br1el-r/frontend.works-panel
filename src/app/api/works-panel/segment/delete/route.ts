import { del } from "@vercel/blob";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { api } from "@/lib/api";
import { isAppError } from "@/lib/api-client";

const deleteSegmentSchema = z.object({
  id: z.number(),
  coverImage: z.string().trim().optional(),
});

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = deleteSegmentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos", issues: z.flattenError(parsed.error) },
      { status: 400 },
    );
  }

  try {
    await api.delete(`/segment/${parsed.data.id}`);

    if (parsed.data.coverImage) {
      await del(parsed.data.coverImage).catch((blobError) => {
        console.error("Falha ao remover imagem de capa da Blob:", blobError);
      });
    }

    revalidateTag("segments", { expire: 0 });

    return new NextResponse(null, { status: 204 });
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
