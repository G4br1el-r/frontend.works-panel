import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do cliente."),
  cellPhone: z
    .string()
    .min(1, "Informe o celular do cliente.")
    .refine(
      (value) => value.replace(/\D/g, "").length === 11,
      "Celular inválido.",
    ),
  document: z
    .string()
    .min(1, "Informe o CPF ou CNPJ do cliente.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      if (digits.length === 11) return cpf.isValid(digits);
      if (digits.length === 14) return cnpj.isValid(digits);
      return false;
    }, "CPF ou CNPJ inválido."),
  addressType: z.enum(["RESIDENTIAL", "COMMERCIAL"], {
    error: "Selecione o tipo de endereço.",
  }),
  cep: z
    .string()
    .min(1, "CEP é obrigatório.")
    .refine((value) => value.replace(/\D/g, "").length === 8, "CEP inválido."),
  state: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP."),
  city: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP."),
  neighborhood: z
    .string()
    .trim()
    .min(1, "Aguarde a busca do endereço pelo CEP."),
  street: z.string().trim().min(1, "Aguarde a busca do endereço pelo CEP."),
  number: z.string().trim().min(1, "Informe o número."),
  latitude: z.number(),
  longitude: z.number(),
});

export type CreateCustomerFormData = z.input<typeof createCustomerSchema>;
export type CreateCustomerFormOutput = z.output<typeof createCustomerSchema>;
