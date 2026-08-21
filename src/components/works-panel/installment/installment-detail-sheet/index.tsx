"use client";

import {
  Ban,
  CalendarDays,
  Clock,
  Download,
  FileText,
  HardHat,
  Mail,
  MapPin,
  Phone,
  Wallet,
  X,
} from "lucide-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import type {
  BudgetDetailLineType,
  BudgetDetailType,
} from "@/@type/works-panel/installment/get-installment.type";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { downloadBudgetPdf } from "@/lib/order/download-budget-pdf";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDocument } from "@/lib/utils/format-document";
import { getInitials } from "@/lib/utils/get-initials";
import { formatDueDate } from "@/lib/utils/installment";

interface InstallmentDetailSheetProps {
  budget: BudgetDetailType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="font-medium text-[11px] text-panel-muted-foreground uppercase tracking-wider">
      {children}
    </h3>
  );
}

/** Linha de contato: ícone dá o contexto, dispensando label redundante. */
function ContactRow({
  icon: Icon,
  value,
  hint,
}: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-panel-muted-foreground" />
      <div className="flex min-w-0 flex-col">
        <span className="break-words text-panel-surface-foreground text-sm">
          {value}
        </span>
        {hint && (
          <span className="text-panel-muted-foreground text-xs">{hint}</span>
        )}
      </div>
    </div>
  );
}

function LinesSection({
  title,
  lines,
}: {
  title: string;
  lines: BudgetDetailLineType[];
}) {
  if (lines.length === 0) return null;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <SectionTitle>{title}</SectionTitle>
        <span className="text-panel-muted-foreground text-xs">
          {lines.length} {lines.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <ul className="divide-y divide-panel-border overflow-hidden rounded-xl border border-panel-border">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex items-start justify-between gap-3 bg-panel-surface p-3 transition-colors hover:bg-panel-page/40"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="break-words font-medium text-panel-surface-foreground text-sm">
                {line.name}
              </span>
              <span className="text-panel-muted-foreground text-xs tabular-nums">
                {line.quantity}
                {line.measureName ? ` ${line.measureName}` : ""} ×{" "}
                {formatCurrency(line.unitPrice)}
              </span>
            </div>
            <span className="shrink-0 whitespace-nowrap font-semibold text-panel-surface-foreground text-sm tabular-nums">
              {formatCurrency(line.total)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function InstallmentDetailSheet({
  budget,
  open,
  onOpenChange,
}: InstallmentDetailSheetProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadCurrent() {
    if (!budget) return;

    setIsDownloading(true);
    try {
      await toast.promise(downloadBudgetPdf(budget.id), {
        loading: "Gerando o PDF...",
        success: "PDF baixado.",
        error: "Não foi possível gerar o PDF.",
      });
    } catch {
      // O toast.promise já notificou.
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-panel-border bg-panel-page p-0 sm:max-w-lg!"
      >
        <SheetHeader className="shrink-0 flex-row items-start justify-between gap-3 space-y-0 border-panel-border border-b bg-panel-surface p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-1">
            <SheetTitle className="flex flex-wrap items-center gap-2 font-bold text-lg text-panel-surface-foreground">
              Orçamento #{budget?.id}
              {budget?.isCanceled && (
                <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-status-danger/30 bg-status-danger-bg px-2 py-0.5 font-medium text-[11px] text-status-danger uppercase tracking-wide">
                  <Ban className="size-3" />
                  Cancelado
                </span>
              )}
            </SheetTitle>
            <SheetDescription className="text-panel-muted-foreground text-xs sm:text-sm">
              Detalhes do serviço e histórico de envios.
            </SheetDescription>
          </div>
          <SheetClose className="shrink-0 cursor-pointer rounded-md p-1 text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground focus:outline-hidden focus:ring-2 focus:ring-panel-accent">
            <X className="size-4" />
            <span className="sr-only">Fechar</span>
          </SheetClose>
        </SheetHeader>

        {budget && (
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4 sm:p-6">
            {budget.isCanceled && (
              <div className="flex items-start gap-2.5 rounded-xl border border-status-danger/30 bg-status-danger-bg px-4 py-3">
                <Ban className="mt-0.5 size-4 shrink-0 text-status-danger" />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-medium text-sm text-status-danger">
                    Orçamento cancelado
                  </span>
                  <span className="text-panel-muted-foreground text-xs">
                    As parcelas em aberto foram canceladas. Os pagamentos já
                    recebidos permanecem no histórico.
                  </span>
                </div>
              </div>
            )}

            {/* Cliente — avatar ancora a identidade, contatos vêm com ícone */}
            <section className="flex flex-col gap-4 rounded-xl border border-panel-border bg-panel-surface p-4">
              <div className="flex items-center gap-3.5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-panel-accent-light font-bold text-panel-accent text-sm ring-4 ring-panel-accent-light/40">
                  {getInitials(budget.customerName)}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate font-semibold text-base text-panel-surface-foreground">
                    {budget.customerName}
                  </span>
                  <span className="text-panel-muted-foreground text-xs tabular-nums">
                    {formatDocument(budget.customerDocument)}
                  </span>
                </div>
              </div>

              {(budget.customerEmail ||
                budget.customerPhone ||
                budget.addressLabel) && (
                <div className="flex flex-col gap-2.5 border-panel-border border-t pt-3.5">
                  {budget.customerEmail && (
                    <ContactRow icon={Mail} value={budget.customerEmail} />
                  )}
                  {budget.customerPhone && (
                    <ContactRow icon={Phone} value={budget.customerPhone} />
                  )}
                  {budget.addressLabel && (
                    <ContactRow icon={MapPin} value={budget.addressLabel} />
                  )}
                </div>
              )}
            </section>

            {/* Obra — período e total lado a lado, total com peso visual */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1 rounded-xl border border-panel-border bg-panel-surface p-4">
                <span className="flex items-center gap-1.5 text-[11px] text-panel-muted-foreground uppercase tracking-wider">
                  <CalendarDays className="size-3.5" />
                  Período
                </span>
                <span className="font-medium text-panel-surface-foreground text-sm tabular-nums">
                  {formatDueDate(budget.startDate)} a{" "}
                  {formatDueDate(budget.endDate)}
                </span>
              </div>

              <div className="flex flex-col gap-1 rounded-xl border border-panel-accent/25 bg-panel-accent-light/50 p-4">
                <span className="text-[11px] text-panel-accent uppercase tracking-wider">
                  Valor total
                </span>
                <strong className="font-bold text-lg text-panel-surface-foreground tabular-nums">
                  {formatCurrency(budget.clientTotal)}
                </strong>
              </div>
            </section>

            {/* Pagamento — condição e primeira parcela */}
            <section className="flex flex-col gap-2.5">
              <SectionTitle>Pagamento</SectionTitle>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-panel-border bg-panel-surface p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-panel-page text-panel-muted-foreground">
                    <Wallet className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-panel-surface-foreground text-sm">
                      {budget.paymentTypeLabel}
                    </span>
                    <span className="text-panel-muted-foreground text-xs">
                      {budget.installmentsCount}{" "}
                      {budget.installmentsCount === 1 ? "parcela" : "parcelas"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="text-[11px] text-panel-muted-foreground uppercase tracking-wider">
                    1º vencimento
                  </span>
                  <span className="font-medium text-panel-surface-foreground text-sm tabular-nums">
                    {formatDueDate(budget.firstInstallmentDate)}
                  </span>
                </div>
              </div>
            </section>

            {/* Dias e horários de trabalho */}
            {budget.attendanceDays.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <SectionTitle>Dias de trabalho</SectionTitle>
                <ul className="divide-y divide-panel-border overflow-hidden rounded-xl border border-panel-border">
                  {budget.attendanceDays.map((day) => (
                    <li
                      key={day.id}
                      className="flex items-center justify-between gap-3 bg-panel-surface p-3"
                    >
                      <span className="font-medium text-panel-surface-foreground text-sm">
                        {day.label}
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-panel-muted-foreground text-xs tabular-nums">
                        <Clock className="size-3.5" />
                        {day.startTime} às {day.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Equipe alocada */}
            {budget.employeers.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <div className="flex items-baseline justify-between gap-2">
                  <SectionTitle>Equipe</SectionTitle>
                  <span className="text-panel-muted-foreground text-xs">
                    {budget.employeers.length}{" "}
                    {budget.employeers.length === 1
                      ? "funcionário"
                      : "funcionários"}
                  </span>
                </div>
                <ul className="divide-y divide-panel-border overflow-hidden rounded-xl border border-panel-border">
                  {budget.employeers.map((employeer) => (
                    <li
                      key={employeer.id}
                      className="flex items-center justify-between gap-3 bg-panel-surface p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-panel-page text-panel-muted-foreground">
                          <HardHat className="size-4" />
                        </span>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate font-medium text-panel-surface-foreground text-sm">
                            {employeer.name}
                          </span>
                          <span className="text-panel-muted-foreground text-xs tabular-nums">
                            {employeer.daysCount}{" "}
                            {employeer.daysCount === 1 ? "diária" : "diárias"} ×{" "}
                            {formatCurrency(employeer.dailyRate)}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 whitespace-nowrap font-semibold text-panel-surface-foreground text-sm tabular-nums">
                        {formatCurrency(employeer.total)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {budget.observation && (
              <section className="flex flex-col gap-2">
                <SectionTitle>Observação</SectionTitle>
                <p className="rounded-xl border border-panel-border bg-panel-surface p-3.5 text-panel-surface-foreground text-sm leading-relaxed">
                  {budget.observation}
                </p>
              </section>
            )}

            <LinesSection title="Serviços" lines={budget.services} />
            <LinesSection title="Materiais" lines={budget.materials} />

            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                <SectionTitle>Orçamentos enviados</SectionTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDownloading}
                  className="cursor-pointer gap-1.5 border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
                  onClick={handleDownloadCurrent}
                >
                  <FileText className="size-4" />
                  PDF atual
                </Button>
              </div>

              {budget.sentPdfs.length === 0 ? (
                <p className="rounded-xl border border-panel-border border-dashed bg-panel-surface/60 p-4 text-center text-panel-muted-foreground text-sm">
                  Nenhum PDF enviado ainda.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {budget.sentPdfs.map((sentPdf, index) => {
                    const isLatest = index === 0;

                    return (
                      <li
                        key={sentPdf.id}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl border bg-panel-surface p-3.5 transition-colors",
                          isLatest
                            ? "border-status-success/40 ring-1 ring-status-success/10"
                            : "border-panel-border",
                        )}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg font-semibold text-xs",
                              isLatest
                                ? "bg-status-success-bg text-status-success"
                                : "bg-panel-page text-panel-muted-foreground",
                            )}
                          >
                            v{sentPdf.version}
                          </span>
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="flex flex-wrap items-center gap-1.5 font-medium text-panel-surface-foreground text-sm">
                              {formatDueDate(sentPdf.sentAt)}
                              {isLatest && (
                                <span className="whitespace-nowrap rounded-full bg-status-success-bg px-1.5 py-0.5 font-medium text-[10px] text-status-success uppercase tracking-wide">
                                  Atual
                                </span>
                              )}
                            </span>
                            <span className="text-panel-muted-foreground text-xs tabular-nums">
                              {formatCurrency(sentPdf.clientTotal)}
                            </span>
                          </div>
                        </div>

                        <a
                          href={`/api/works-panel/budget/${budget.id}/sent-pdf?version=${sentPdf.version}`}
                          className="shrink-0 cursor-pointer rounded-lg border border-panel-border p-2 text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground"
                        >
                          <Download className="size-4" />
                          <span className="sr-only">
                            Baixar versão {sentPdf.version}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
