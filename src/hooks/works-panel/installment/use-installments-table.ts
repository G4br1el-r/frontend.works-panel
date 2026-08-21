"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type {
  InstallmentRowType,
  InstallmentSituation,
} from "@/@type/works-panel/installment/get-installment.type";
import type { DueDateFilterValue } from "@/components/works-panel/installment/due-date-filter";
import { createInstallmentsColumns } from "@/components/works-panel/installment/installments-table/columns";
import { onlyDigits } from "@/lib/utils/format-document";

const SEARCH_DEBOUNCE_MS = 300;

export const SITUATION_FILTER_OPTIONS = [
  { value: "ACTIVE", label: "Todas exceto canceladas" },
  { value: "ALL", label: "Todas" },
  { value: "PENDING", label: "Pendente" },
  { value: "OVERDUE", label: "Atrasado" },
  { value: "PAID", label: "Pago" },
  { value: "CANCELED", label: "Cancelado" },
] as const;

/** `ACTIVE` esconde as canceladas — é o padrão, já que elas são ruído no dia a dia. */
type SituationFilter = InstallmentSituation | "ALL" | "ACTIVE";

/**
 * O backend responde 409 quando a parcela já está no estado pedido — acontece
 * em duplo clique ou com duas abas abertas. Não é falha: sinalizamos como
 * conflito para avisar e recarregar, em vez de estourar erro.
 */
class InstallmentConflictError extends Error {
  constructor(readonly isCanceled = false) {
    super("conflito de estado da parcela");
  }
}

async function mutateInstallment(id: number, action: "pay" | "unpay") {
  const response = await fetch(`/api/works-panel/installment/${id}/${action}`, {
    method: "PATCH",
  });

  if (response.status === 409) {
    const body = await response.json().catch(() => null);
    const message: string = body?.message ?? "";
    throw new InstallmentConflictError(message.includes("canceled"));
  }

  if (!response.ok) {
    throw new Error("Falha ao atualizar parcela");
  }
}

interface UseInstallmentsTableOptions {
  installments: InstallmentRowType[];
}

export function useInstallmentsTable({
  installments,
}: UseInstallmentsTableOptions) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [situation, setSituation] = useState<SituationFilter>("ACTIVE");
  const [dueDate, setDueDate] = useState<DueDateFilterValue>(null);
  const [detailBudgetId, setDetailBudgetId] = useState<number | null>(null);

  const [installmentToPay, setInstallmentToPay] =
    useState<InstallmentRowType | null>(null);
  const [installmentToUnpay, setInstallmentToUnpay] =
    useState<InstallmentRowType | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );

    return () => clearTimeout(timeout);
  }, [search]);

  const filteredInstallments = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    const searchDigits = onlyDigits(normalizedSearch);

    return installments.filter((installment) => {
      if (situation === "ACTIVE") {
        if (installment.situation === "CANCELED") return false;
      } else if (situation !== "ALL" && installment.situation !== situation) {
        return false;
      }

      if (dueDate) {
        const installmentDate = installment.dueDate.slice(0, 10);
        const matchesDate =
          dueDate.mode === "day"
            ? installmentDate === dueDate.date
            : installmentDate.slice(0, 7) === dueDate.date.slice(0, 7);

        if (!matchesDate) return false;
      }

      if (!normalizedSearch) return true;

      const matchesDocument =
        searchDigits.length > 0 &&
        onlyDigits(installment.customerDocument).includes(searchDigits);

      return (
        installment.customerName.toLowerCase().includes(normalizedSearch) ||
        String(installment.budgetId).includes(normalizedSearch) ||
        matchesDocument
      );
    });
  }, [installments, debouncedSearch, situation, dueDate]);

  /**
   * Totais do recorte visível. Diferente dos KPIs do topo, que são fixos e
   * calculados no servidor — estes reagem aos filtros, então vivem aqui.
   */
  const filteredTotals = useMemo(() => {
    return filteredInstallments.reduce(
      (acc, installment) => {
        // Cancelada não entra no total: não é valor a receber nem recebido.
        if (installment.situation !== "CANCELED")
          acc.total += installment.amount;

        if (installment.situation === "CANCELED") {
          acc.canceled += installment.amount;
          acc.canceledCount += 1;
        } else if (installment.situation === "PAID") {
          acc.paid += installment.amount;
          acc.paidCount += 1;
        } else {
          acc.open += installment.amount;
          acc.openCount += 1;

          if (installment.situation === "OVERDUE") {
            acc.overdue += installment.amount;
            acc.overdueCount += 1;
          }
        }

        return acc;
      },
      {
        total: 0,
        paid: 0,
        paidCount: 0,
        open: 0,
        openCount: 0,
        overdue: 0,
        overdueCount: 0,
        canceled: 0,
        canceledCount: 0,
        count: filteredInstallments.length,
      },
    );
  }, [filteredInstallments]);

  const columns = useMemo(
    () =>
      createInstallmentsColumns({
        onPay: setInstallmentToPay,
        onUnpay: setInstallmentToUnpay,
        onViewDetails: (installment) => setDetailBudgetId(installment.budgetId),
        pendingId,
      }),
    [pendingId],
  );

  async function handleMutation(
    installment: InstallmentRowType,
    action: "pay" | "unpay",
  ) {
    setPendingId(installment.id);

    try {
      await toast.promise(mutateInstallment(installment.id, action), {
        loading: action === "pay" ? "Dando baixa..." : "Desfazendo baixa...",
        success:
          action === "pay"
            ? "Baixa registrada com sucesso."
            : "Baixa desfeita com sucesso.",
        error: (error) => {
          if (error instanceof InstallmentConflictError) {
            if (error.isCanceled) {
              return "Esta parcela foi cancelada. Lista atualizada.";
            }

            return action === "pay"
              ? "Esta parcela já estava baixada. Lista atualizada."
              : "Esta parcela já estava em aberto. Lista atualizada.";
          }

          return action === "pay"
            ? "Não foi possível dar baixa na parcela."
            : "Não foi possível desfazer a baixa.";
        },
      });
    } catch (error) {
      // Conflito relança para o toast exibir o aviso, mas o fluxo segue igual:
      // fechamos o diálogo e recarregamos para refletir o estado real.
      if (!(error instanceof InstallmentConflictError)) {
        setPendingId(null);
        return;
      }
    }

    router.refresh();
    setInstallmentToPay(null);
    setInstallmentToUnpay(null);
    setPendingId(null);
  }

  const hasActiveFilters =
    debouncedSearch.trim().length > 0 ||
    situation !== "ALL" ||
    dueDate !== null;

  return {
    filters: {
      search,
      setSearch,
      situation,
      setSituation,
      dueDate,
      setDueDate,
      hasActiveFilters,
    },
    filteredInstallments,
    filteredTotals,
    columns,
    detailSheet: {
      open: detailBudgetId !== null,
      budgetId: detailBudgetId,
      onOpenChange: (open: boolean) => !open && setDetailBudgetId(null),
    },
    payDialog: {
      open: installmentToPay !== null,
      installment: installmentToPay,
      isLoading: pendingId !== null,
      onOpenChange: (open: boolean) => !open && setInstallmentToPay(null),
      onConfirm: () =>
        installmentToPay && handleMutation(installmentToPay, "pay"),
    },
    unpayDialog: {
      open: installmentToUnpay !== null,
      installment: installmentToUnpay,
      isLoading: pendingId !== null,
      onOpenChange: (open: boolean) => !open && setInstallmentToUnpay(null),
      onConfirm: () =>
        installmentToUnpay && handleMutation(installmentToUnpay, "unpay"),
    },
  };
}

export type UseInstallmentsTableReturn = ReturnType<
  typeof useInstallmentsTable
>;
