"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format-currency";

function formatDate(value: string) {
  const date = new Date(value);
  const dateLabel = date.toLocaleDateString("pt-BR");
  const timeLabel = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateLabel} às ${timeLabel}`;
}

interface CreateMaterialsColumnsOptions {
  onEdit?: (material: MaterialResponseType) => void;
  onDelete?: (material: MaterialResponseType) => void;
}

export function createMaterialsColumns({
  onEdit,
  onDelete,
}: CreateMaterialsColumnsOptions): ColumnDef<MaterialResponseType>[] {
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
      id: "basePrice",
      accessorFn: (material) => Number(material.basePrice),
      header: "Preço base",
      cell: ({ getValue }) => (
        <span className="font-medium text-panel-surface-foreground">
          {formatCurrency(getValue<number>())}
        </span>
      ),
    },
    {
      id: "measure",
      accessorFn: (material) => material.measure?.name ?? "",
      header: "Medida",
      cell: ({ row }) =>
        row.original.measure ? (
          <span className="inline-flex items-center rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
            {row.original.measure.name}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full border border-dashed border-panel-border px-2 py-0.5 text-xs text-panel-muted-foreground">
            Sem medida
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
          {getValue<boolean>() ? "Ativo" : "Inativo"}
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
