"use client";

import { Info } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils/cn";
import { useNewOrderStore } from "@/store/works-panel/order/new-order-store";
import { WrapperForm } from "../wrapper-form";

const SEGMENTS = [
  {
    key: "material",
    label: "Material",
    className: "bg-panel-surface-foreground",
  },
  { key: "employeer", label: "Mão de obra", className: "bg-panel-accent" },
  { key: "service", label: "Serviço", className: "bg-panel-border" },
  { key: "margin", label: "Margem", className: "bg-status-warning" },
] as const;

export function PricingForm() {
  const absorbCost = useNewOrderStore((state) => state.absorbCost);
  const profitMargin = useNewOrderStore((state) => state.profitMargin);
  const setAbsorbCost = useNewOrderStore((state) => state.setAbsorbCost);
  const setProfitMargin = useNewOrderStore((state) => state.setProfitMargin);
  const summary = useNewOrderStore(
    useShallow((state) => state.getPricingSummary()),
  );

  const barTotal =
    summary.materialSubtotal +
    summary.employeerSubtotal +
    summary.serviceSubtotal +
    summary.marginAmount;

  const segmentValues: Record<(typeof SEGMENTS)[number]["key"], number> = {
    material: summary.materialSubtotal,
    employeer: summary.employeerSubtotal,
    service: summary.serviceSubtotal,
    margin: summary.marginAmount,
  };

  return (
    <WrapperForm
      title="Precificação"
      description="Defina a margem de lucro e como o custo será cobrado."
      icon="percent"
    >
      <div className="flex w-full flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-panel-muted-foreground sm:text-xs sm:tracking-widest">
              CUSTO DE MATERIAL E MÃO DE OBRA
              <TooltipComponent content="Quando marcado, você paga o custo de materiais e mão de obra do seu bolso — o cliente não vê nem paga esses itens. Sua margem de lucro continua garantida por cima do valor de serviços.">
                <Info className="size-3 shrink-0 text-panel-muted-foreground" />
              </TooltipComponent>
            </span>
            <label className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-lg border border-panel-border bg-panel-surface px-3 has-data-[state=checked]:border-panel-accent">
              <Checkbox
                checked={absorbCost}
                onCheckedChange={(checked) => setAbsorbCost(checked === true)}
              />
              <span className="text-sm font-medium text-panel-surface-foreground">
                Absorver o custo
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-panel-muted-foreground sm:text-xs sm:tracking-widest">
              MARGEM DE LUCRO (%)
              <TooltipComponent content="Percentual de lucro aplicado sobre o valor de serviços. Esse lucro é garantido mesmo se você absorver o custo de materiais e mão de obra.">
                <Info className="size-3 shrink-0 text-panel-muted-foreground" />
              </TooltipComponent>
            </span>
            <input
              type="number"
              min={0}
              step={1}
              value={profitMargin}
              onChange={(event) => setProfitMargin(event.target.value)}
              placeholder="0"
              className="h-11 w-full rounded-lg border border-panel-border bg-panel-surface px-3 text-base sm:text-sm text-panel-surface-foreground outline-none focus-visible:border-panel-accent focus-visible:ring-2 focus-visible:ring-panel-accent/20"
            />
          </div>
        </div>

        <div className="flex h-7 w-full min-w-0 overflow-hidden rounded-lg bg-panel-page sm:h-9">
          {barTotal > 0 &&
            SEGMENTS.map((segment) => {
              const value = segmentValues[segment.key];
              if (value <= 0) return null;
              const width = (value / barTotal) * 100;

              return (
                <span
                  key={segment.key}
                  className={cn("h-full", segment.className)}
                  style={{ width: `${width}%` }}
                />
              );
            })}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          {SEGMENTS.map((segment) => (
            <span
              key={segment.key}
              className="flex min-w-0 items-center gap-1.5 text-xs text-panel-muted-foreground"
            >
              <span
                className={cn(
                  "size-2.5 shrink-0 rounded-sm",
                  segment.className,
                )}
              />
              <span className="truncate">
                {segment.label} {formatCurrency(segmentValues[segment.key])}
              </span>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 border-t border-panel-border pt-4 sm:grid-cols-2">
          <SummaryRow
            label="Subtotal de serviços"
            value={formatCurrency(summary.serviceSubtotal)}
          />
          <SummaryRow
            label="Custo de materiais"
            value={formatCurrency(summary.materialSubtotal)}
          />
          <SummaryRow
            label="Custo de mão de obra"
            value={formatCurrency(summary.employeerSubtotal)}
          />
          <SummaryRow
            label="Custo total da obra"
            value={formatCurrency(summary.costTotal)}
            strong
            hint="Soma do custo de materiais e mão de obra."
          />
          <SummaryRow
            label="Base de cálculo"
            value={formatCurrency(summary.baseAmount)}
            hint="Valor de serviços sobre o qual a margem de lucro é calculada."
          />
          <SummaryRow
            label={`Margem (${summary.profitMargin}%)`}
            value={formatCurrency(summary.marginAmount)}
            strong
            hint="Valor do seu lucro: percentual de margem aplicado sobre a base de cálculo."
          />
          <SummaryRow
            label="Total geral da obra"
            value={formatCurrency(summary.serviceSubtotal + summary.costTotal)}
            hint="Soma de serviços, materiais e mão de obra, sem considerar margem de lucro."
          />
          <SummaryRow
            label="Lucro líquido real (R$)"
            value={formatCurrency(summary.netProfitAmount)}
            strong
            tone={summary.netProfitAmount < 0 ? "danger" : "success"}
            hint="Valor final ao cliente menos o custo total da obra (materiais + mão de obra). É o dinheiro que sobra no seu bolso."
          />
          <SummaryRow
            label="Valor final ao cliente"
            value={formatCurrency(summary.clientTotal)}
            strong
            hint="Valor total que será cobrado do cliente, considerando a margem e se o custo foi absorvido ou não."
          />
        </div>

        {absorbCost && summary.costTotal > 0 && (
          <p className="rounded-lg bg-status-danger-bg px-3 py-2.5 text-[11px] text-status-danger sm:text-xs">
            Custo absorvido: {formatCurrency(summary.costTotal)} saem do seu
            bolso e reduzem seu lucro líquido.
          </p>
        )}
      </div>
    </WrapperForm>
  );
}

function SummaryRow({
  label,
  value,
  strong,
  hint,
  tone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  hint?: string;
  tone?: "success" | "danger";
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 border-b border-panel-border/60 pb-2.5 last:border-b-0 sm:gap-3">
      <span className="flex min-w-0 items-center gap-1.5 text-xs text-panel-muted-foreground sm:text-sm">
        <span className="truncate">{label}</span>
        {hint && (
          <TooltipComponent content={hint}>
            <Info className="size-3 shrink-0 text-panel-muted-foreground" />
          </TooltipComponent>
        )}
      </span>
      <span
        className={cn(
          "shrink-0 text-right font-mono text-xs tabular-nums text-panel-surface-foreground sm:text-sm",
          strong && "font-semibold sm:text-base",
          tone === "success" && "text-status-success",
          tone === "danger" && "text-status-danger",
        )}
      >
        {value}
      </span>
    </div>
  );
}
