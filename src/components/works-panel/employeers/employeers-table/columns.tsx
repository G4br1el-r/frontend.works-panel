"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import type { EmployeerScheduleSummary } from "@/lib/utils/employeer-schedule";
import { formatCurrency } from "@/lib/utils/format-currency";
import { formatDate } from "@/lib/utils/format-date";

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function getInitials(name: string) {
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

interface CreateEmployeersColumnsOptions {
  onEdit?: (employeer: EmployeerResponseType) => void;
  onDelete?: (employeer: EmployeerResponseType) => void;
  onViewSchedule?: (employeer: EmployeerResponseType) => void;
  /** Resumo pré-carregado no servidor, indexado por id — evita N+1 por linha. */
  schedules?: Record<number, EmployeerScheduleSummary>;
}

export function createEmployeersColumns({
  onEdit,
  onDelete,
  onViewSchedule,
  schedules,
}: CreateEmployeersColumnsOptions): ColumnDef<EmployeerResponseType>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-panel-accent-light text-xs font-semibold text-panel-accent">
            {getInitials(row.original.name)}
          </span>
          <span className="font-medium text-panel-surface-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      id: "dailyRate",
      accessorFn: (employeer) => toNumber(employeer.dailyRate),
      header: "Diária",
      cell: ({ getValue }) => (
        <span className="font-medium text-panel-surface-foreground">
          {formatCurrency(getValue<number>())}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Cadastrado em",
      cell: ({ row }) => (
        <span className="text-panel-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: "agendaDays",
      header: "Dias da agenda",
      enableSorting: false,
      cell: ({ row }) => {
        const summary = schedules?.[row.original.id];

        if (!summary || summary.confirmedDays === 0) {
          return (
            <span className="text-panel-muted-foreground text-sm">
              Sem obra agendada
            </span>
          );
        }

        return (
          <button
            type="button"
            onClick={() => onViewSchedule?.(row.original)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-panel-border bg-panel-page px-2.5 py-1 font-medium text-panel-surface-foreground text-xs transition-colors hover:border-panel-accent hover:bg-panel-accent-light hover:text-panel-accent"
          >
            <CalendarDays className="size-3.5" />
            <span className="tabular-nums">
              {summary.confirmedDays}{" "}
              {summary.confirmedDays === 1 ? "dia" : "dias"}
            </span>
            <span className="text-panel-muted-foreground">
              · {summary.worksCount}{" "}
              {summary.worksCount === 1 ? "obra" : "obras"}
            </span>
          </button>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      enableSorting: false,
      meta: { align: "center" },
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <TooltipComponent content="Editar" disableHoverableContent>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer text-panel-muted-foreground hover:bg-sidebar-accent hover:text-panel-accent!"
              onClick={() => onEdit?.(row.original)}
            >
              <Pencil className="size-4" />
              <span className="sr-only">Editar {row.original.name}</span>
            </Button>
          </TooltipComponent>
          <TooltipComponent content="Excluir" disableHoverableContent>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer text-panel-muted-foreground hover:bg-sidebar-accent hover:text-destructive!"
              onClick={() => onDelete?.(row.original)}
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Excluir {row.original.name}</span>
            </Button>
          </TooltipComponent>
        </div>
      ),
    },
  ];
}
