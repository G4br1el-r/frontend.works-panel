"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Package, Pencil, Trash2 } from "lucide-react";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

function formatCurrency(value: number | string) {
  const price = typeof value === "number" ? value : Number(value);
  return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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

interface CreateServiceItemsColumnsOptions {
  onEdit?: (serviceItem: ServiceItemResponseType) => void;
  onDelete?: (serviceItem: ServiceItemResponseType) => void;
  onViewMaterials?: (serviceItem: ServiceItemResponseType) => void;
}

export function createServiceItemsColumns({
  onEdit,
  onDelete,
  onViewMaterials,
}: CreateServiceItemsColumnsOptions): ColumnDef<ServiceItemResponseType>[] {
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
      id: "segment",
      accessorFn: (serviceItem) => serviceItem.segment?.name ?? "",
      header: "Segmento",
      cell: ({ row }) =>
        row.original.segment ? (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
            {row.original.segment.name}
          </span>
        ) : (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-dashed border-panel-border px-2 py-0.5 text-xs text-panel-muted-foreground">
            Sem segmento
          </span>
        ),
    },
    {
      id: "basePrice",
      accessorFn: (serviceItem) => Number(serviceItem.basePrice),
      header: "Preço base",
      cell: ({ getValue }) => (
        <span className="font-medium text-panel-surface-foreground">
          {formatCurrency(getValue<number>())}
        </span>
      ),
    },
    {
      id: "measure",
      accessorFn: (serviceItem) => serviceItem.measure?.name ?? "",
      header: "Medida",
      cell: ({ row }) =>
        row.original.measure ? (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground">
            {row.original.measure.name}
          </span>
        ) : (
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-dashed border-panel-border px-2 py-0.5 text-xs text-panel-muted-foreground">
            Sem medida
          </span>
        ),
    },
    {
      id: "materialsCount",
      accessorFn: (serviceItem) => serviceItem.materials.length,
      header: "Materiais",
      cell: ({ row }) => {
        const materials = row.original.materials;

        return (
          <TooltipComponent
            content={
              materials.length > 0
                ? "Clique para ver os materiais vinculados"
                : "Nenhum material vinculado"
            }
            disableHoverableContent
          >
            <button
              type="button"
              onClick={() => onViewMaterials?.(row.original)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent hover:bg-panel-accent-light hover:text-panel-accent"
            >
              <Package className="size-3.5" />
              {materials.length}
            </button>
          </TooltipComponent>
        );
      },
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
