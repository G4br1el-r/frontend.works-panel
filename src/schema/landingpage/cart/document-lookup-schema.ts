import { cnpj, cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const documentLookupSchema = z.object({
  document: z
    .string()
    .min(1, "Informe seu CPF ou CNPJ")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");

      if (digits.length === 11) return cpf.isValid(digits);
      if (digits.length === 14) return cnpj.isValid(digits);

      return false;
    }, "CPF ou CNPJ inválido"),
});

export type DocumentLookupFormData = z.infer<typeof documentLookupSchema>;
