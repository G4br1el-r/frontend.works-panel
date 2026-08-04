import { z } from "zod";

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome ou o nome da empresa"),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((value) => value.replace(/\D/g, "").length === 8, "CEP inválido"),
  phone: z
    .string()
    .min(1, "Celular é obrigatório")
    .refine(
      (value) => value.replace(/\D/g, "").length === 11,
      "Celular inválido",
    ),
});

export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
