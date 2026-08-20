import { z } from "zod";

export const customerRegisterSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome ou o nome da empresa"),
  cellPhone: z
    .string()
    .min(1, "Celular é obrigatório")
    .refine(
      (value) => value.replace(/\D/g, "").length === 11,
      "Celular inválido",
    ),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail")
    .pipe(z.email("E-mail inválido")),
  addressType: z.enum(["RESIDENTIAL", "COMMERCIAL"], {
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

export type CustomerRegisterFormData = z.input<typeof customerRegisterSchema>;
export type CustomerRegisterFormOutput = z.output<
  typeof customerRegisterSchema
>;
