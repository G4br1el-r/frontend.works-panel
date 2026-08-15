import { z } from "zod";

export const addressRegisterSchema = z.object({
  type: z.enum(["RESIDENTIAL", "COMMERCIAL"], {
    error: "Selecione o tipo de endereço",
  }),
  cep: z
    .string()
    .min(1, "CEP é obrigatório")
    .refine((value) => value.replace(/\D/g, "").length === 8, "CEP inválido"),
  state: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP"),
  city: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP"),
  neighborhood: z
    .string()
    .trim()
    .min(1, "Aguarde a busca do endereço pelo CEP"),
  street: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP"),
  number: z.string().trim().min(1, "Informe o número"),
  latitude: z.number(),
  longitude: z.number(),
});

export type AddressRegisterFormData = z.input<typeof addressRegisterSchema>;
export type AddressRegisterFormOutput = z.output<typeof addressRegisterSchema>;
