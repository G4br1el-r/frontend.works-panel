import z from "zod";

export const measureSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da medida."),
  active: z.boolean().default(true),
});

export type MeasureFormData = z.input<typeof measureSchema>;
export type MeasureFormOutput = z.output<typeof measureSchema>;
