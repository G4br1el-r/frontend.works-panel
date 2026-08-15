import { z } from "zod";

export const customerCreatePayloadSchema = z.object({
  name: z.string().trim().min(1),
  cellPhone: z.string().min(1),
  document: z.string().min(1),
  addresses: z
    .array(
      z.object({
        type: z.enum(["RESIDENTIAL", "COMMERCIAL"]),
        cep: z.string().min(1),
        state: z.string().trim().min(1),
        city: z.string().trim().min(1),
        neighborhood: z.string().trim().min(1),
        street: z.string().trim().min(1),
        number: z.string().trim().min(1),
        latitude: z.number(),
        longitude: z.number(),
      }),
    )
    .min(1),
});

export type CustomerCreatePayload = z.infer<typeof customerCreatePayloadSchema>;
