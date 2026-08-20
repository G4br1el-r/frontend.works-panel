"use client";

import { format, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, Trash2 } from "lucide-react";
import { DatePicker } from "@/components/shared/date-picker";
import { InputComponent } from "@/components/shared/input-component";
import {
  SelectCombobox,
  type SelectComboboxOption,
} from "@/components/shared/select-combobox";
import { Button } from "@/components/ui/button";
import { useBudgetFieldErrors } from "@/hooks/works-panel/order/use-budget-field-errors";
import { formatCurrency, maskCurrency, unmaskCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import {
  getInstallmentCountByAmount,
  type PaymentType,
  splitAmountEqually,
} from "@/lib/utils/generate-installments";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { WrapperForm } from "../wrapper-form";

const PAYMENT_TYPE_OPTIONS: SelectComboboxOption[] = [
  { value: "single", label: "Pagamento único" },
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quinzenal" },
  { value: "monthly", label: "Mensal" },
];

export function PaymentForm() {
  const startDate = useNewOrderStore((state) => state.startDate);
  const endDate = useNewOrderStore((state) => state.endDate);
  const paymentType = useNewOrderStore((state) => state.paymentType);
  const firstInstallmentDate = useNewOrderStore(
    (state) => state.firstInstallmentDate,
  );
  const installments = useNewOrderStore((state) => state.installments);
  const setPaymentType = useNewOrderStore((state) => state.setPaymentType);
  const setFirstInstallmentDate = useNewOrderStore(
    (state) => state.setFirstInstallmentDate,
  );
  const generateInstallments = useNewOrderStore(
    (state) => state.generateInstallments,
  );
  const updateInstallmentDueDate = useNewOrderStore(
    (state) => state.updateInstallmentDueDate,
  );
  const updateInstallmentAmount = useNewOrderStore(
    (state) => state.updateInstallmentAmount,
  );
  const removeInstallment = useNewOrderStore(
    (state) => state.removeInstallment,
  );
  const clientTotal = useNewOrderStore(
    (state) => state.getPricingSummary().clientTotal,
  );
  const installmentAmount = useNewOrderStore(
    (state) => state.installmentAmount,
  );
  const setInstallmentAmount = useNewOrderStore(
    (state) => state.setInstallmentAmount,
  );
  const installmentCount = useNewOrderStore((state) => state.installmentCount);
  const setInstallmentCount = useNewOrderStore(
    (state) => state.setInstallmentCount,
  );
  const installmentMode = useNewOrderStore((state) => state.installmentMode);
  const setInstallmentMode = useNewOrderStore(
    (state) => state.setInstallmentMode,
  );
  const fieldErrors = useBudgetFieldErrors();

  const isSinglePayment = paymentType === "single";
  const isByAmount = installmentMode === "amount";
  const fixedAmount = unmaskCurrency(installmentAmount);
  const fixedCount = Number(installmentCount || 0);

  // Antecipa o que será gerado, conforme o modo escolhido.
  const installmentPreview = (() => {
    if (isSinglePayment || clientTotal <= 0) return null;

    if (isByAmount && fixedAmount > 0) {
      const count = getInstallmentCountByAmount(clientTotal, fixedAmount);
      const lastAmount = clientTotal - fixedAmount * (count - 1);

      if (count === 1) {
        return {
          headline: `1x de ${formatCurrency(clientTotal)}`,
          detail: null,
        };
      }

      // A última fecha o total e quase nunca é cheia: contá-la junto das
      // demais faria a soma parecer maior do que é.
      const isLastFull = Math.abs(lastAmount - fixedAmount) < 0.01;

      if (isLastFull) {
        return {
          headline: `${count}x de ${formatCurrency(fixedAmount)}`,
          detail: null,
        };
      }

      return {
        headline: `${count - 1}x de ${formatCurrency(fixedAmount)} + 1x de ${formatCurrency(lastAmount)}`,
        detail: `${count} parcelas · total ${formatCurrency(clientTotal)}`,
      };
    }

    if (!isByAmount && fixedCount > 0) {
      const amounts = splitAmountEqually(clientTotal, fixedCount);
      const lastAmount = amounts[amounts.length - 1];
      const isLastEqual = Math.abs(lastAmount - amounts[0]) < 0.01;

      if (isLastEqual || fixedCount === 1) {
        return {
          headline: `${fixedCount}x de ${formatCurrency(amounts[0])}`,
          detail: null,
        };
      }

      // Sobra de centavos vai para a última: separar evita somar errado de cabeça.
      return {
        headline: `${fixedCount - 1}x de ${formatCurrency(amounts[0])} + 1x de ${formatCurrency(lastAmount)}`,
        detail: `${fixedCount} parcelas · total ${formatCurrency(clientTotal)}`,
      };
    }

    return null;
  })();

  const hasSchedule = Boolean(startDate && endDate);
  const canGenerate =
    hasSchedule &&
    Boolean(firstInstallmentDate) &&
    clientTotal > 0 &&
    // Parcelado precisa do campo do modo escolhido; no único, de nenhum.
    (isSinglePayment || (isByAmount ? fixedAmount > 0 : fixedCount > 0));

  const installmentsTotal = installments.reduce(
    (sum, row) => sum + row.amount,
    0,
  );

  function handleDueDateChange(id: string, value: string) {
    const [day, month, year] = value.split("/").map(Number);
    if (!day || !month || !year) return;
    updateInstallmentDueDate(id, new Date(year, month - 1, day));
  }

  return (
    <WrapperForm
      title="Financeiro"
      description="Defina como o valor final será cobrado do cliente."
      icon="wallet"
    >
      <div className="flex w-full min-w-0 flex-col gap-5">
        {!hasSchedule ? (
          <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-panel-border p-6 text-center text-sm text-panel-muted-foreground sm:p-8">
            Defina o prazo da obra para gerar as parcelas.
          </div>
        ) : (
          <>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11px] font-semibold tracking-wide text-panel-muted-foreground sm:text-xs sm:tracking-widest">
                  TIPO DE PAGAMENTO
                </span>
                <SelectCombobox
                  options={PAYMENT_TYPE_OPTIONS}
                  value={paymentType}
                  onChange={(value) =>
                    setPaymentType((value ?? "single") as PaymentType)
                  }
                  placeholder="Selecione o tipo de pagamento"
                />
              </div>

              <div className="flex min-w-0 flex-col gap-1.5">
                <span className="text-[11px] font-semibold tracking-wide text-panel-muted-foreground sm:text-xs sm:tracking-widest">
                  {isSinglePayment ? "DATA DO PAGAMENTO" : "DATA DA 1ª PARCELA"}
                </span>
                <DatePicker
                  id="first-installment-date"
                  value={firstInstallmentDate}
                  onChange={setFirstInstallmentDate}
                  placeholder="dd/mm/aaaa"
                  hasError={Boolean(fieldErrors.firstInstallmentDate)}
                />
              </div>
            </div>

            {/* Pagamento único cobra o total de uma vez: não há o que dividir. */}
            {!isSinglePayment && (
              <div className="flex min-w-0 flex-col gap-3">
                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                  <InstallmentModeOption
                    label="Pelo valor da parcela"
                    description="Defino quanto o cliente paga por vez"
                    checked={isByAmount}
                    onSelect={() => setInstallmentMode("amount")}
                  >
                    <InputComponent.wrapper
                      iconName="wallet"
                      classNameWrapper={cn(
                        "h-11 rounded-lg border bg-panel-surface focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20",
                        fieldErrors.installmentAmount && isByAmount
                          ? "animate-shake border-destructive"
                          : "border-panel-border",
                      )}
                      classNameIcon="text-panel-muted-foreground"
                    >
                      <InputComponent.maskedCurrency
                        id="installment-amount"
                        value={installmentAmount}
                        onChange={setInstallmentAmount}
                        readOnly={!isByAmount}
                        placeHolder="R$ 0,00"
                        className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                      />
                    </InputComponent.wrapper>
                  </InstallmentModeOption>

                  <InstallmentModeOption
                    label="Pelo número de parcelas"
                    description="Defino em quantas vezes dividir"
                    checked={!isByAmount}
                    onSelect={() => setInstallmentMode("count")}
                  >
                    <input
                      type="text"
                      inputMode="numeric"
                      value={installmentCount}
                      onChange={(event) =>
                        // Parcela é contagem: só dígitos, sem ponto nem vírgula.
                        setInstallmentCount(
                          event.target.value.replace(/\D/g, ""),
                        )
                      }
                      disabled={isByAmount}
                      placeholder="Ex: 10"
                      className={cn(
                        "h-11 w-full rounded-lg border bg-panel-surface px-3 text-base text-panel-surface-foreground outline-none focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20 disabled:cursor-not-allowed disabled:bg-panel-page/60 disabled:text-panel-muted-foreground sm:text-sm",
                        fieldErrors.installmentAmount && !isByAmount
                          ? "animate-shake border-destructive"
                          : "border-panel-border",
                      )}
                    />
                  </InstallmentModeOption>
                </div>

                {installmentPreview && (
                  <p className="text-xs text-panel-muted-foreground">
                    <span className="font-medium text-panel-surface-foreground">
                      {installmentPreview.headline}
                    </span>
                    {installmentPreview.detail &&
                      ` · ${installmentPreview.detail}`}
                  </p>
                )}
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              className="w-full cursor-pointer gap-1.5 hover:bg-panel-border sm:w-fit"
              disabled={!canGenerate}
              onClick={generateInstallments}
            >
              <CalendarClock className="size-4" />
              Gerar parcelas
            </Button>

            {installments.length > 0 && (
              <div className="flex w-full min-w-0 flex-col">
                <div className="hidden items-center gap-3 border-b border-panel-border pb-2 text-xs font-semibold tracking-wide text-panel-muted-foreground lg:grid lg:grid-cols-[3.5rem_1fr_1fr_6rem_2rem]">
                  <span>PARCELA</span>
                  <span>VENCIMENTO</span>
                  <span>VALOR</span>
                  <span>SITUAÇÃO</span>
                  <span />
                </div>

                <ul className="flex min-w-0 flex-col divide-y divide-panel-border">
                  {installments.map((row) => {
                    const pastDue = isPastDue(row.dueDate);

                    const renderDueDateField = (variant: string) => (
                      <DatePicker
                        id={`installment-due-date-${variant}-${row.id}`}
                        value={format(row.dueDate, "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                        onChange={(value) => handleDueDateChange(row.id, value)}
                      />
                    );

                    const renderAmountField = (variant: string) => (
                      <InputComponent.wrapper
                        iconName="wallet"
                        classNameWrapper="h-11 rounded-lg border border-panel-border bg-panel-surface focus-within:border-panel-accent focus-within:ring-2 focus-within:ring-panel-accent/20"
                        classNameIcon="text-panel-muted-foreground"
                      >
                        <InputComponent.maskedCurrency
                          id={`installment-amount-${variant}-${row.id}`}
                          value={maskCurrency(row.amount)}
                          onChange={(value) =>
                            updateInstallmentAmount(
                              row.id,
                              unmaskCurrency(value),
                            )
                          }
                          placeHolder="R$ 0,00"
                          className="bg-transparent text-base text-panel-surface-foreground placeholder:text-panel-muted-foreground sm:text-sm"
                        />
                      </InputComponent.wrapper>
                    );

                    const statusBadge = (
                      <span
                        className={cn(
                          "flex h-7 w-fit shrink-0 items-center justify-center rounded-md px-2 text-xs font-semibold",
                          pastDue
                            ? "bg-status-danger-bg text-status-danger"
                            : "bg-panel-page text-panel-muted-foreground",
                        )}
                      >
                        {pastDue ? "Atrasada" : "Pendente"}
                      </span>
                    );

                    const removeButton = (
                      <button
                        type="button"
                        onClick={() => removeInstallment(row.id)}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-panel-muted-foreground outline-none transition-colors hover:bg-status-danger-bg hover:text-status-danger focus-visible:bg-status-danger-bg focus-visible:text-status-danger focus-visible:ring-2 focus-visible:ring-status-danger/30"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">
                          Remover parcela {row.number}
                        </span>
                      </button>
                    );

                    return (
                      <li key={row.id} className="min-w-0 py-3">
                        {/* Desktop: mesma ordem de colunas do cabeçalho */}
                        <div className="hidden items-center gap-3 lg:grid lg:grid-cols-[3.5rem_1fr_1fr_6rem_2rem]">
                          <span className="text-sm font-medium text-panel-surface-foreground">
                            {row.number}/{installments.length}
                          </span>
                          <div className="min-w-0">
                            {renderDueDateField("desktop")}
                          </div>
                          <div className="min-w-0">
                            {renderAmountField("desktop")}
                          </div>
                          {statusBadge}
                          {removeButton}
                        </div>

                        {/* Mobile/tablet: card empilhado */}
                        <div className="flex min-w-0 flex-col gap-2 lg:hidden">
                          <div className="flex min-w-0 items-center justify-between gap-2">
                            <span className="shrink-0 text-sm font-medium text-panel-surface-foreground">
                              {row.number}/{installments.length}
                            </span>
                            <div className="flex shrink-0 items-center gap-2">
                              {statusBadge}
                              {removeButton}
                            </div>
                          </div>

                          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="min-w-0">
                              {renderDueDateField("mobile")}
                            </div>
                            <div className="min-w-0">
                              {renderAmountField("mobile")}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex items-center justify-between gap-3 border-t border-panel-border pt-3">
                  <span className="shrink-0 text-xs text-panel-muted-foreground">
                    Soma das parcelas
                  </span>
                  <span className="shrink-0 text-right font-mono text-sm font-semibold text-panel-surface-foreground tabular-nums sm:text-base">
                    {formatCurrency(installmentsTotal)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </WrapperForm>
  );
}

function isPastDue(date: Date) {
  return isBefore(date, startOfDay(new Date()));
}

interface InstallmentModeOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

/** Opção de parcelamento: o rádio libera o campo correspondente. */
function InstallmentModeOption({
  label,
  description,
  checked,
  onSelect,
  children,
}: InstallmentModeOptionProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2.5 rounded-lg border p-3 transition-colors",
        checked
          ? "border-panel-accent bg-panel-surface"
          : "border-panel-border bg-panel-surface/60",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 cursor-pointer items-start gap-2.5 text-left"
      >
        <span
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            checked ? "border-panel-accent" : "border-panel-border",
          )}
        >
          {checked && <span className="size-2 rounded-full bg-panel-accent" />}
        </span>

        <span className="flex min-w-0 flex-col">
          <span
            className={cn(
              "text-sm font-medium",
              checked
                ? "text-panel-surface-foreground"
                : "text-panel-muted-foreground",
            )}
          >
            {label}
          </span>
          <span className="text-[11px] text-panel-muted-foreground sm:text-xs">
            {description}
          </span>
        </span>
      </button>

      {children}
    </div>
  );
}
