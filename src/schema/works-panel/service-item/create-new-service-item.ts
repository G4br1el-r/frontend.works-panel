import z from "zod";

export const serviceItemSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do serviço."),
  basePrice: z
    .string()
    .min(1, "Informe o preço base.")
    .transform((value) => Number(value.replace(/\./g, "").replace(",", ".")))
    .refine((value) => value > 0, "Informe o preço base."),
  active: z.boolean().default(true),
  measureId: z.number().nullable().default(null),
  segmentId: z.number().nullable().default(null),
  materialIds: z.array(z.number()).default([]),
});

export type ServiceItemFormData = z.input<typeof serviceItemSchema>;
export type ServiceItemFormOutput = z.output<typeof serviceItemSchema>;

export const createServiceItemPayloadSchema = serviceItemSchema.extend({
  basePrice: z.number().positive("Informe o preço base."),
});
