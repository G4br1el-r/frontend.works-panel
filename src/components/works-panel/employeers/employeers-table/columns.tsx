"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { EmployeerResponseData } from "@/@type/works-panel/employeer/get-employeer.type";
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

interface CreateEmployeersColumnsOptions {
  onEdit?: (employeer: EmployeerResponseData) => void;
  onDelete?: (employeer: EmployeerResponseData) => void;
}

export function createEmployeersColumns({
  onEdit,
  onDelete,
}: CreateEmployeersColumnsOptions): ColumnDef<EmployeerResponseData>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      id: "dailyRate",
      accessorFn: (employeer) => toNumber(employeer.dailyRate),
      header: "Diária",
      cell: ({ getValue }) => formatCurrency(getValue<number>()),
    },
    {
      accessorKey: "createdAt",
      header: "Cadastrado em",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "agendaDays",
      header: "Dias da agenda",
      enableSorting: false,
      cell: () => <span className="text-panel-muted-foreground">—</span>,
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
