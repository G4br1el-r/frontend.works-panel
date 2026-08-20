"use client";

import { ArrowLeft, Copy, Lock, Pencil, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import type {
  BudgetResponseType,
  BudgetSentPdfResponseType,
} from "@/@type/works-panel/order/get-budget.type";
import { Button } from "@/components/ui/button";
import { WrapperForm } from "@/components/works-panel/new-order/wrapper-form";
import { BudgetPdfActions } from "@/components/works-panel/order/budget-pdf-actions";
import { BudgetStatusSelect } from "@/components/works-panel/order/budget-status-select";
import {
  BUDGET_STATUS_CLASSNAME,
  BUDGET_STATUS_LABEL,
  formatBudgetDate,
  isBudgetEditable,
} from "@/lib/order/format-budget";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

const WEEK_DAY_LABELS: Record<string, string> = {
  SUN: "Domingo",
  MON: "Segunda",
  TUE: "Terça",
  WED: "Quarta",
  THU: "Quinta",
  FRI: "Sexta",
  SAT: "Sábado",
};

interface BudgetDetailProps {
  budget: BudgetResponseType;
  sentPdfs: BudgetSentPdfResponseType[];
}

export function BudgetDetail({ budget, sentPdfs }: BudgetDetailProps) {
  const router = useRouter();
  const editable = isBudgetEditable(budget.status);

  // Não confia na ordem devolvida pela API — escolhe o envio mais recente
  // pela data, já que reenviar um orçamento antigo não pode parecer "não enviado".
  const lastSent = sentPdfs.reduce<BudgetSentPdfResponseType | null>(
    (latest, sent) =>
      !latest || new Date(sent.sentAt) > new Date(latest.sentAt)
        ? sent
        : latest,
    null,
  );

  // O comprovante é congelado no envio: se o valor final mudou depois, o que
  // o cliente tem em mãos não reflete mais o orçamento atual. Não usa
  // `updatedAt` porque esse campo muda em qualquer edição, inclusive trocar
  // só o status — o que não afeta o que já foi enviado ao cliente.
  const hasUnsentChanges =
    lastSent !== null &&
    Number(budget.clientTotal) !== Number(lastSent.clientTotal);

  // `allocations` vem achatado (uma linha por funcionário+data).
  const employeerGroups = Object.values(
    budget.allocations.reduce<
      Record<number, { name: string; dailyRate: number; dates: string[] }>
    >((acc, allocation) => {
      const existing = acc[allocation.employeerId];

      if (existing) {
        existing.dates.push(allocation.date);
        return acc;
      }

      acc[allocation.employeerId] = {
        name: allocation.employeer?.name ?? "Funcionário",
        dailyRate: Number(allocation.dailyRate),
        dates: [allocation.date],
      };
      return acc;
    }, {}),
  );

  const servicesTotal = budget.services.reduce(
    (sum, service) =>
      sum + Number(service.quantity) * Number(service.unitPrice),
    0,
  );
  const materialsTotal = budget.materials.reduce(
    (sum, material) =>
      sum + Number(material.quantity) * Number(material.unitPrice),
    0,
  );
  const employeersTotal = budget.allocations.reduce(
    (sum, allocation) => sum + Number(allocation.dailyRate),
    0,
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => router.push("/gestao-obras/orcamentos")}
            className="mt-1 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:border-panel-accent hover:text-panel-accent"
          >
            <ArrowLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-lg text-panel-surface-foreground sm:text-2xl">
                Orçamento #{budget.id}
              </h1>
              <span
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium",
                  BUDGET_STATUS_CLASSNAME[budget.status],
                )}
              >
                {BUDGET_STATUS_LABEL[budget.status]}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-panel-muted-foreground sm:text-sm">
              {budget.customer?.name} · criado em{" "}
              {formatBudgetDate(budget.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <BudgetStatusSelect budgetId={budget.id} status={budget.status} />

          <BudgetPdfActions
            budgetId={budget.id}
            customerEmail={budget.customer?.email ?? null}
            sentPdfs={sentPdfs}
          />

          {editable && (
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer gap-1.5 hover:bg-panel-border"
              onClick={() =>
                router.push(`/gestao-obras/orcamentos/novo?editar=${budget.id}`)
              }
            >
              <Pencil className="size-4" />
              Editar
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer gap-1.5 hover:bg-panel-border"
            onClick={() =>
              router.push(`/gestao-obras/orcamentos/novo?duplicar=${budget.id}`)
            }
          >
            <Copy className="size-4" />
            Duplicar
          </Button>
        </div>
      </div>

      {!editable && (
        <p className="flex items-center gap-1.5 rounded-lg bg-panel-page px-3 py-2.5 text-xs text-panel-muted-foreground sm:text-sm">
          <Lock className="size-3.5 shrink-0" />
          Orçamento {BUDGET_STATUS_LABEL[budget.status].toLowerCase()} não pode
          ser editado. Para alterar, duplique em um novo orçamento.
        </p>
      )}

      {lastSent && (
        <p
          className={cn(
            "flex flex-wrap items-center gap-x-1.5 gap-y-0.5 rounded-lg px-3 py-2.5 text-xs sm:text-sm",
            hasUnsentChanges
              ? "bg-status-warning-bg text-status-warning"
              : "bg-panel-page text-panel-muted-foreground",
          )}
        >
          <Send className="size-3.5 shrink-0" />
          {hasUnsentChanges ? (
            <>
              Há alterações não enviadas. O cliente recebeu a versão de{" "}
              {formatBudgetDate(lastSent.sentAt)} por{" "}
              {formatCurrency(Number(lastSent.clientTotal))}.
            </>
          ) : (
            <>
              Enviado ao cliente em {formatBudgetDate(lastSent.sentAt)} por{" "}
              {formatCurrency(Number(lastSent.clientTotal))}
              {sentPdfs.length > 1 && ` · ${sentPdfs.length} envios`}.
            </>
          )}
        </p>
      )}

      <WrapperForm title="Cliente" icon="user">
        <div className="flex w-full min-w-0 flex-col gap-1">
          <span className="text-sm font-medium text-panel-surface-foreground">
            {budget.customer?.name ?? "—"}
          </span>
          <span className="text-xs text-panel-muted-foreground sm:text-sm">
            {budget.address
              ? `${budget.address.street}, ${budget.address.number} — ${budget.address.city}`
              : "Sem endereço"}
          </span>
        </div>
      </WrapperForm>

      <WrapperForm title="Prazo e atendimento" icon="calendar">
        <div className="flex w-full min-w-0 flex-col gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-panel-muted-foreground">
              Início:{" "}
              <span className="font-medium text-panel-surface-foreground">
                {formatBudgetDate(budget.startDate)}
              </span>
            </span>
            <span className="text-panel-muted-foreground">
              Fim:{" "}
              <span className="font-medium text-panel-surface-foreground">
                {formatBudgetDate(budget.endDate)}
              </span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {budget.attendanceDays.map((day) => (
              <span
                key={day.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs text-panel-surface-foreground"
              >
                {WEEK_DAY_LABELS[day.weekDay] ?? day.weekDay}
                <span className="text-panel-muted-foreground">
                  {day.startTime}–{day.endTime}
                </span>
              </span>
            ))}
          </div>
        </div>
      </WrapperForm>

      <WrapperForm title="Serviços" icon="wrench">
        <div className="flex w-full min-w-0 flex-col">
          <ul className="flex min-w-0 flex-col divide-y divide-panel-border">
            {budget.services.map((service) => (
              <li
                key={service.id}
                className="flex min-w-0 items-center justify-between gap-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-panel-surface-foreground">
                    {service.serviceItem?.name ?? "Serviço"}
                  </p>
                  <p className="truncate text-xs text-panel-muted-foreground">
                    {Number(service.quantity)} ×{" "}
                    {formatCurrency(Number(service.unitPrice))}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                  {formatCurrency(
                    Number(service.quantity) * Number(service.unitPrice),
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between gap-3 border-t border-panel-border pt-3">
            <span className="text-xs text-panel-muted-foreground">Total</span>
            <span className="font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
              {formatCurrency(servicesTotal)}
            </span>
          </div>
        </div>
      </WrapperForm>

      {budget.materials.length > 0 && (
        <WrapperForm title="Materiais" icon="package">
          <div className="flex w-full min-w-0 flex-col">
            <ul className="flex min-w-0 flex-col divide-y divide-panel-border">
              {budget.materials.map((material) => (
                <li
                  key={material.id}
                  className="flex min-w-0 items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-panel-surface-foreground">
                      {material.material?.name ?? "Material"}
                    </p>
                    <p className="truncate text-xs text-panel-muted-foreground">
                      {Number(material.quantity)} ×{" "}
                      {formatCurrency(Number(material.unitPrice))}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                    {formatCurrency(
                      Number(material.quantity) * Number(material.unitPrice),
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3 border-t border-panel-border pt-3">
              <span className="text-xs text-panel-muted-foreground">Total</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                {formatCurrency(materialsTotal)}
              </span>
            </div>
          </div>
        </WrapperForm>
      )}

      {employeerGroups.length > 0 && (
        <WrapperForm title="Funcionários" icon="hardHat">
          <div className="flex w-full min-w-0 flex-col">
            <ul className="flex min-w-0 flex-col divide-y divide-panel-border">
              {employeerGroups.map((group) => (
                <li
                  key={group.name}
                  className="flex min-w-0 items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-panel-surface-foreground">
                      {group.name}
                    </p>
                    <p className="truncate text-xs text-panel-muted-foreground">
                      {group.dates.length} dia(s) ×{" "}
                      {formatCurrency(group.dailyRate)}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                    {formatCurrency(group.dates.length * group.dailyRate)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-3 border-t border-panel-border pt-3">
              <span className="text-xs text-panel-muted-foreground">Total</span>
              <span className="font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                {formatCurrency(employeersTotal)}
              </span>
            </div>
          </div>
        </WrapperForm>
      )}

      <WrapperForm title="Precificação" icon="percent">
        <div className="grid w-full min-w-0 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <DetailRow
            label="Margem de lucro"
            value={`${Number(budget.profitMargin)}%`}
          />
          <DetailRow
            label="Custo absorvido"
            value={budget.absorbCost ? "Sim" : "Não"}
          />
          <DetailRow
            label="Valor final ao cliente"
            value={formatCurrency(Number(budget.clientTotal))}
            strong
          />
        </div>
      </WrapperForm>

      <WrapperForm title="Financeiro" icon="wallet">
        <div className="flex w-full min-w-0 flex-col">
          <ul className="flex min-w-0 flex-col divide-y divide-panel-border">
            {budget.installments.map((installment) => (
              <li
                key={installment.id}
                className="flex min-w-0 items-center justify-between gap-3 py-2.5"
              >
                <span className="shrink-0 text-sm font-medium text-panel-surface-foreground">
                  {installment.number}/{budget.installments.length}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-panel-muted-foreground">
                  {formatBudgetDate(installment.dueDate)}
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-panel-surface-foreground">
                  {formatCurrency(Number(installment.amount))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </WrapperForm>

      {budget.observation && (
        <WrapperForm title="Observação" icon="fileText">
          <p className="w-full min-w-0 whitespace-pre-wrap text-sm text-panel-surface-foreground">
            {budget.observation}
          </p>
        </WrapperForm>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 border-b border-panel-border/60 pb-2 last:border-b-0">
      <span className="truncate text-sm text-panel-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "shrink-0 font-mono text-sm tabular-nums text-panel-surface-foreground",
          strong && "text-base font-semibold",
        )}
      >
        {value}
      </span>
    </div>
  );
}
