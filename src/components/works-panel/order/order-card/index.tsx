"use client";

import { Calendar, ChevronRight, MapPin, Package, Route } from "lucide-react";
import type {
  OrderResponseType,
  OrderStatus,
} from "@/@type/works-panel/order/get-order.type";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; text: string; bg: string; dot: string; pulse: boolean }
> = {
  PENDING: {
    label: "Pendente",
    text: "text-status-warning",
    bg: "bg-status-warning-bg",
    dot: "bg-status-warning",
    pulse: true,
  },
  ACCEPTED: {
    label: "Aceito",
    text: "text-status-success",
    bg: "bg-status-success-bg",
    dot: "bg-status-success",
    pulse: false,
  },
  CANCELED: {
    label: "Cancelado",
    text: "text-status-danger",
    bg: "bg-status-danger-bg",
    dot: "bg-status-danger",
    pulse: false,
  },
};

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }

  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }

  return value;
}

function formatDistance(distanceInMeters: number) {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  return `${(distanceInMeters / 1000).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function getInitials(name: string) {
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

interface OrderCardProps {
  order: OrderResponseType;
}

export function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_CONFIG[order.status];
  const total = order.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0,
  );
  const itemCount = order.items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0,
  );

  const statusBadge = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        status.bg,
        status.text,
      )}
    >
      <span className="relative flex size-1.5 shrink-0">
        {status.pulse && (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              status.dot,
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            status.dot,
          )}
        />
      </span>
      {status.label}
    </span>
  );

  return (
    <button
      type="button"
      className="group relative flex w-full cursor-pointer flex-col gap-4 overflow-hidden rounded-xl border border-panel-border bg-panel-surface p-4 text-left shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-panel-accent/50 hover:shadow-lg sm:flex-row sm:items-center sm:gap-6 sm:p-5"
    >
      <div className="flex min-w-0 items-center justify-between gap-3 sm:w-56 sm:shrink-0 sm:justify-start sm:gap-3.5">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-panel-accent-light text-sm font-bold text-panel-accent ring-4 ring-panel-accent-light/40">
            {getInitials(order.customer.name)}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-[0.95rem] font-semibold text-panel-surface-foreground">
              {order.customer.name}
            </p>
            <p className="truncate font-mono text-xs text-panel-muted-foreground">
              {formatDocument(order.customer.document)}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:hidden">{statusBadge}</div>
      </div>

      <div
        className="hidden h-10 w-px shrink-0 bg-panel-border sm:block"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-2.5 border-t border-panel-border pt-5 pb-3 sm:flex-row sm:min-w-0 sm:flex-1 sm:items-center sm:gap-x-6 sm:gap-y-0 sm:border-0 sm:pt-0 sm:pb-0">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:w-40 sm:shrink-0">
          <MapPin
            size={14}
            className="shrink-0 text-panel-muted-foreground"
            aria-hidden="true"
          />
          <span className="truncate text-sm text-panel-surface-foreground">
            {order.address.city}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-panel-accent sm:w-16">
          <Route size={12} className="shrink-0" aria-hidden="true" />
          {formatDistance(order.address.distanceInMeters)}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-sm text-panel-muted-foreground sm:w-24">
          <Package size={14} className="shrink-0" aria-hidden="true" />
          {itemCount} {itemCount === 1 ? "serviço" : "serviços"}
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-sm text-panel-muted-foreground sm:w-32">
          <Calendar size={14} className="shrink-0" aria-hidden="true" />
          {formatDate(order.createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-panel-border pt-5 sm:shrink-0 sm:gap-6 sm:border-0 sm:pt-0">
        <div className="hidden sm:block">{statusBadge}</div>

        <span className="shrink-0 text-right font-mono text-base font-bold text-panel-surface-foreground tabular-nums sm:w-24">
          {formatCurrency(total)}
        </span>

        <ChevronRight
          size={18}
          className="hidden shrink-0 text-panel-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-panel-accent sm:block"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}
