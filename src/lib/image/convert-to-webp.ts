import sharp from "sharp";

export async function convertToWebp(
  input: ArrayBuffer,
  quality: number,
): Promise<Buffer> {
  return sharp(Buffer.from(input)).webp({ quality }).toBuffer();
}
