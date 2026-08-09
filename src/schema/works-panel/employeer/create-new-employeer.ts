import { z } from "zod";

export const employeerSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do funcionário."),
  dailyRate: z
    .string()
    .min(1, "Informe o valor da diária.")
    .transform((value) => Number(value.replace(/\./g, "").replace(",", ".")))
    .refine((value) => value > 0, "Informe o valor da diária."),
});

export type EmployeerFormData = z.input<typeof employeerSchema>;
export type EmployeerFormOutput = z.output<typeof employeerSchema>;

export const createEmployeerPayloadSchema = employeerSchema.extend({
  dailyRate: z.number().positive("Informe o valor da diária."),
});
