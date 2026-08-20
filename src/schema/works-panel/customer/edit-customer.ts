import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const customerSchema = z.object({
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
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail do cliente.")
    .pipe(z.email("E-mail inválido.")),
  observation: z.string().optional(),
});

export type CustomerFormData = z.input<typeof customerSchema>;
export type CustomerFormOutput = z.output<typeof customerSchema>;

export const editCustomerPayloadSchema = z.object({
  name: z.string().trim().min(1),
  cellPhone: z.string().min(1),
  document: z.string().min(1),
  email: z.string().trim().min(1).pipe(z.email()),
  observation: z.string().optional(),
});
