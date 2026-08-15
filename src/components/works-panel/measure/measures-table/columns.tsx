"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

function formatDate(value: string) {
  const date = new Date(value);
  const dateLabel = date.toLocaleDateString("pt-BR");
  const timeLabel = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel} às ${timeLabel}`;
}

interface CreateMeasuresColumnsOptions {
  onEdit?: (measure: MeasureResponseType) => void;
  onDelete?: (measure: MeasureResponseType) => void;
}

export function createMeasuresColumns({
  onEdit,
  onDelete,
}: CreateMeasuresColumnsOptions): ColumnDef<MeasureResponseType>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <span className="font-medium text-panel-surface-foreground">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ getValue }) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
            getValue<boolean>()
              ? "bg-status-success-bg text-status-success"
              : "bg-status-danger-bg text-status-danger",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              getValue<boolean>() ? "bg-status-success" : "bg-status-danger",
            )}
          />
          {getValue<boolean>() ? "Ativa" : "Inativa"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Cadastrada em",
      cell: ({ row }) => (
        <span className="text-panel-muted-foreground">
          {formatDate(row.original.createdAt)}
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
