import { z } from "zod";

/**
 * Espelha o contrato do POST /budget. As mensagens são as que aparecem na tela,
 * então falam a língua do usuário — não a do backend.
 */

const weekDaySchema = z.enum(["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]);

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.");

const attendanceDaySchema = z.object({
  weekDay: weekDaySchema,
  startTime: timeSchema,
  endTime: timeSchema,
});

const scheduleSchema = z.object({
  startDate: z.string().min(1, "Informe o início da obra."),
  endDate: z.string().min(1, "Informe o fim da obra."),
  attendanceDays: z
    .array(attendanceDaySchema)
    .min(1, "Selecione ao menos um dia de atendimento."),
});

const serviceSchema = z.object({
  serviceItemId: z.number(),
  quantity: z.number().positive("A quantidade deve ser maior que zero."),
  unitPrice: z.number().positive("O valor unitário deve ser maior que zero."),
});

const materialSchema = z.object({
  materialId: z.number(),
  quantity: z.number().positive("A quantidade deve ser maior que zero."),
  unitPrice: z.number().positive("O valor unitário deve ser maior que zero."),
  fromServiceItemIds: z.array(z.number()),
});

const employeerSchema = z.object({
  employeerId: z.number(),
  dailyRate: z.number().positive("A diária deve ser maior que zero."),
  dates: z.array(z.string()).min(1, "Selecione ao menos um dia de trabalho."),
});

const pricingSchema = z.object({
  absorbCost: z.boolean(),
  profitMargin: z.number().min(0, "A margem não pode ser negativa."),
  clientTotal: z
    .number()
    .positive("O valor final ao cliente deve ser maior que zero."),
});

const installmentSchema = z.object({
  number: z.number().int().positive(),
  dueDate: z.string().min(1, "Informe o vencimento."),
  amount: z.number().positive("O valor da parcela deve ser maior que zero."),
  isManuallyEdited: z.boolean().optional(),
});

const paymentSchema = z.object({
  paymentType: z.enum(["single", "weekly", "biweekly", "monthly"]),
  firstInstallmentDate: z.string().min(1, "Informe a data de pagamento."),
  installments: z
    .array(installmentSchema)
    .min(1, "Gere as parcelas antes de confirmar."),
});

/** Tolerância de 1 centavo, igual à do backend. */
const INSTALLMENTS_TOLERANCE = 0.01;

function hasUniqueIds<T>(items: T[], getId: (item: T) => number) {
  const ids = items.map(getId);
  return new Set(ids).size === ids.length;
}

export const createBudgetSchema = z
  .object({
    customerId: z.number({ error: "Selecione o cliente." }),
    addressId: z.number({ error: "Selecione o endereço do cliente." }),
    sourceOrderId: z.number().optional(),
    /** Ausente = nasce DRAFT. Use para orçamento já fechado presencialmente. */
    status: z.enum(["DRAFT", "SENT", "APPROVED", "REJECTED"]).optional(),
    schedule: scheduleSchema,
    services: z
      .array(serviceSchema)
      .min(1, "Adicione ao menos um serviço ao orçamento."),
    materials: z.array(materialSchema),
    employeers: z.array(employeerSchema),
    pricing: pricingSchema,
    payment: paymentSchema,
    observation: z.string(),
  })
  // A soma das parcelas precisa bater com o total — o backend devolve 400 se não bater.
  .refine(
    (data) => {
      const total = data.payment.installments.reduce(
        (sum, installment) => sum + installment.amount,
        0,
      );
      return (
        Math.abs(total - data.pricing.clientTotal) <= INSTALLMENTS_TOLERANCE
      );
    },
    {
      path: ["payment", "installments"],
      error:
        "A soma das parcelas não bate com o valor final ao cliente. Ajuste os valores.",
    },
  )
  // Materiais só podem referenciar serviços presentes no orçamento.
  .refine(
    (data) => {
      const serviceItemIds = new Set(
        data.services.map((service) => service.serviceItemId),
      );
      return data.materials.every((material) =>
        material.fromServiceItemIds.every((id) => serviceItemIds.has(id)),
      );
    },
    {
      path: ["materials"],
      error: "Há material vinculado a um serviço que não está no orçamento.",
    },
  )
  .refine(
    (data) => hasUniqueIds(data.services, (service) => service.serviceItemId),
    { path: ["services"], error: "Há serviços repetidos no orçamento." },
  )
  .refine(
    (data) => hasUniqueIds(data.materials, (material) => material.materialId),
    { path: ["materials"], error: "Há materiais repetidos no orçamento." },
  )
  .refine(
    (data) =>
      hasUniqueIds(data.employeers, (employeer) => employeer.employeerId),
    { path: ["employeers"], error: "Há funcionários repetidos no orçamento." },
  )
  .refine(
    (data) =>
      data.employeers.every(
        (employeer) => new Set(employeer.dates).size === employeer.dates.length,
      ),
    { path: ["employeers"], error: "Há funcionário com dias repetidos." },
  )
  .refine(
    (data) =>
      hasUniqueIds(
        data.payment.installments,
        (installment) => installment.number,
      ),
    {
      path: ["payment", "installments"],
      error: "Há parcelas com o mesmo número.",
    },
  );

export type CreateBudgetFormData = z.input<typeof createBudgetSchema>;
export type CreateBudgetFormOutput = z.output<typeof createBudgetSchema>;
