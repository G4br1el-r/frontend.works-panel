import z from "zod";

export const segmentSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do funcionário."),
  description: z.string().trim().min(1, "Informe a descrição do segmento."),
  coverImage: z.string().trim().min(1, "Informe a imagem de capa do segmento."),
  active: z.boolean().default(true),
});

export type SegmentFormData = z.input<typeof segmentSchema>;
export type SegmentFormOutput = z.output<typeof segmentSchema>;
