import { z } from "zod";

export const createOrderPayloadSchema = z.object({
  customerId: z.number(),
  addressId: z.number(),
  serviceItemIds: z.array(z.number()).min(1),
});

export type CreateOrderPayload = z.infer<typeof createOrderPayloadSchema>;
