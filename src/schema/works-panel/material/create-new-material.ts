import z from "zod";

export const materialSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do material."),
  basePrice: z
    .string()
    .min(1, "Informe o preço base.")
    .transform((value) => Number(value.replace(/\./g, "").replace(",", ".")))
    .refine((value) => value > 0, "Informe o preço base."),
  active: z.boolean().default(true),
  measureId: z.number().nullable().default(null),
});

export type MaterialFormData = z.input<typeof materialSchema>;
export type MaterialFormOutput = z.output<typeof materialSchema>;

export const createMaterialPayloadSchema = materialSchema.extend({
  basePrice: z.number().positive("Informe o preço base."),
});
