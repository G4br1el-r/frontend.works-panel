import { del, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { convertToWebp } from "@/lib/image/convert-to-webp";
import {
  SEGMENT_COVER_ALLOWED_MIME_PREFIX,
  SEGMENT_COVER_MAX_FILE_SIZE_BYTES,
  SEGMENT_COVER_WEBP_QUALITY,
} from "@/lib/utils/constants";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!file.type.startsWith(SEGMENT_COVER_ALLOWED_MIME_PREFIX)) {
    return NextResponse.json({ message: "O arquivo enviado não é uma imagem." }, { status: 400 });
  }

  if (file.size > SEGMENT_COVER_MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: "A imagem deve ter no máximo 5MB." }, { status: 400 });
  }

  let webpBuffer: Buffer;
  try {
    webpBuffer = await convertToWebp(await file.arrayBuffer(), SEGMENT_COVER_WEBP_QUALITY);
  } catch {
    return NextResponse.json({ message: "Não foi possível processar a imagem." }, { status: 400 });
  }

  const blob = await put(`segments/${crypto.randomUUID()}.webp`, webpBuffer, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/webp",
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    url?: string;
  } | null;
  const url = body?.url;

  if (!url || !url.includes(".public.blob.vercel-storage.com/")) {
    return NextResponse.json({ message: "URL inválida." }, { status: 400 });
  }

  await del(url);

  return new NextResponse(null, { status: 204 });
}
