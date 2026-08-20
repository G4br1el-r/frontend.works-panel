"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type {
  BudgetResponseType,
  BudgetSendResponseType,
} from "@/@type/works-panel/order/get-budget.type";
import { buildOrderPayload } from "@/lib/order/build-order-payload";
import { downloadBudgetPdf } from "@/lib/order/download-budget-pdf";
import {
  type CreateBudgetFormOutput,
  createBudgetSchema,
} from "@/schema/works-panel/order/create-budget";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";

export type BudgetSendChannel = "email" | "whatsapp" | "pdf" | "none";

class CreateBudgetError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function saveBudget(
  payload: CreateBudgetFormOutput,
  editingBudgetId: number | null,
) {
  const isEditing = editingBudgetId !== null;

  const response = await fetch(
    isEditing
      ? `/api/works-panel/budget/${editingBudgetId}/update`
      : "/api/works-panel/budget/create",
    {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message[0]
      : body?.message;

    throw new CreateBudgetError(
      message ?? "Falha ao salvar o orçamento",
      body?.code,
    );
  }

  return (await response.json()) as BudgetResponseType;
}

async function registerBudgetSend(budgetId: number, channels: string[]) {
  const response = await fetch(`/api/works-panel/budget/${budgetId}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ channels }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new CreateBudgetError(
      body?.message ?? "Falha ao registrar o envio",
      body?.code,
    );
  }

  return (await response.json()) as BudgetSendResponseType;
}

/**
 * Registra o envio ao cliente: gera o PDF, arquiva como comprovante e marca o
 * orçamento como enviado. No canal email, o backend também dispara o e-mail
 * para o cliente. No canal PDF, o front dispara o download.
 */
async function sendBudgetToCustomer(
  budgetId: number,
  channel: BudgetSendChannel,
) {
  const channels = channel === "email" ? ["email"] : [];

  await toast.promise(registerBudgetSend(budgetId, channels), {
    loading:
      channel === "email"
        ? "Enviando orçamento por e-mail..."
        : "Gerando o orçamento para envio...",
    success:
      channel === "email"
        ? "Orçamento enviado por e-mail."
        : "Orçamento marcado como enviado.",
    error: (error) =>
      error instanceof CreateBudgetError
        ? error.message
        : "Não foi possível registrar o envio.",
  });

  if (channel === "pdf") {
    await toast.promise(downloadBudgetPdf(budgetId), {
      loading: "Baixando o PDF...",
      success: "PDF baixado.",
      error: "Não foi possível baixar o PDF.",
    });
    return;
  }

  if (channel === "whatsapp") {
    toast("O envio automático por WhatsApp ainda será implementado.", {
      id: "budget-send-channel",
    });
  }
}

interface UseCreateNewBudgetOptions {
  onCreated?: (budget: BudgetResponseType) => void;
}

/**
 * O estado do orçamento vive no `useNewOrderStore` — este hook cuida da
 * validação e do envio. O schema é o mesmo que a API route usa, então o erro
 * aparece na tela antes de virar 400 do backend.
 */
export function useCreateNewBudget({
  onCreated,
}: UseCreateNewBudgetOptions = {}) {
  const router = useRouter();

  // Assina os campos da store individualmente: montar o payload dentro do
  // seletor devolveria um objeto novo a cada chamada e causaria loop infinito.
  const customerId = useNewOrderStore((state) => state.customerId);
  const addressId = useNewOrderStore((state) => state.addressId);
  const sourceOrderId = useNewOrderStore((state) => state.sourceOrderId);
  const editingBudgetId = useNewOrderStore((state) => state.editingBudgetId);
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const attendanceDays = useNewOrderStore((state) => state.attendanceDays);
  const serviceRows = useNewOrderStore((state) => state.serviceRows);
  const materialRows = useNewOrderStore((state) => state.materialRows);
  const employeerRows = useNewOrderStore((state) => state.employeerRows);
  const paymentType = useNewOrderStore((state) => state.paymentType);
  const firstInstallmentDate = useNewOrderStore(
    (state) => state.firstInstallmentDate,
  );
  const installments = useNewOrderStore((state) => state.installments);
  const observation = useNewOrderStore((state) => state.observation);
  const getPricingSummary = useNewOrderStore(
    (state) => state.getPricingSummary,
  );
  const setHasSubmitted = useNewOrderStore((state) => state.setHasSubmitted);

  const payload = buildOrderPayload({
    customerId,
    addressId,
    sourceOrderId,
    startDate,
    endDate,
    attendanceDays,
    serviceRows,
    materialRows,
    employeerRows,
    pricing: getPricingSummary(),
    paymentType,
    firstInstallmentDate,
    installments,
    observation,
  });

  const parsed = createBudgetSchema.safeParse(payload);

  async function onSubmit(channel: BudgetSendChannel) {
    if (!parsed.success) {
      setHasSubmitted(true);
      toast.error(
        parsed.error.issues[0]?.message ?? "Confira os campos destacados.",
        { id: "create-budget-error" },
      );
      return;
    }

    // Entregar ao cliente é responsabilidade do POST /send, que arquiva o
    // comprovante e marca como SENT. Aqui o orçamento só nasce como rascunho.
    const isSendingToCustomer = channel !== "none";
    const isEditing = editingBudgetId !== null;

    try {
      const budget = await toast.promise(
        saveBudget(
          {
            ...parsed.data,
            // Na edição, omitir o status mantém o atual do orçamento.
            ...(isEditing ? {} : { status: "DRAFT" as const }),
          },
          editingBudgetId,
        ),
        {
          loading: isEditing
            ? "Atualizando orçamento..."
            : "Salvando orçamento...",
          success: isEditing
            ? "Orçamento atualizado."
            : "Orçamento salvo como rascunho.",
          error: (error) =>
            error instanceof CreateBudgetError
              ? error.message
              : "Não foi possível salvar o orçamento.",
        },
      );

      if (isSendingToCustomer) {
        await sendBudgetToCustomer(budget.id, channel);
      }

      onCreated?.(budget);
      router.push("/gestao-obras/orcamentos");
      router.refresh();
    } catch {
      // O toast.promise já notificou o usuário.
    }
  }

  return {
    onSubmit,
    isValid: parsed.success,
  };
}

export type UseCreateNewBudgetReturn = ReturnType<typeof useCreateNewBudget>;
