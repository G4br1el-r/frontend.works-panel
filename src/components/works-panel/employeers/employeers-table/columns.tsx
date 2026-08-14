"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function toNumber(value: number | string) {
  return typeof value === "number" ? value : Number(value);
}

function formatDate(value: string) {
  const date = new Date(value);
  const dateLabel = date.toLocaleDateString("pt-BR");
  const timeLabel = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel} às ${timeLabel}`;
}

function getInitials(name: string) {
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

interface CreateEmployeersColumnsOptions {
  onEdit?: (employeer: EmployeerResponseType) => void;
  onDelete?: (employeer: EmployeerResponseType) => void;
}

export function createEmployeersColumns({
  onEdit,
  onDelete,
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
      cell: () => (
        <span className="inline-flex items-center rounded-full border border-dashed border-panel-border px-2 py-0.5 text-xs text-panel-muted-foreground">
          Em breve
        </span>
      ),
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
