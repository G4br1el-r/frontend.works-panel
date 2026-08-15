"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Link, Pencil, Trash2 } from "lucide-react";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { ImageComponent } from "@/components/shared/image-component";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format-date";

interface CreateSegmentsColumnsOptions {
  onEdit?: (segment: SegmentResponseType) => void;
  onDelete?: (segment: SegmentResponseType) => void;
  onViewServiceItems?: (segment: SegmentResponseType) => void;
}

export function createSegmentsColumns({
  onEdit,
  onDelete,
  onViewServiceItems,
}: CreateSegmentsColumnsOptions): ColumnDef<SegmentResponseType>[] {
  return [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="relative size-9 shrink-0 overflow-hidden rounded-md border border-panel-border bg-panel-page">
            <ImageComponent
              src={row.original.coverImage}
              alt={row.original.name}
              classNameImg="object-cover"
              sizes="36px"
            />
          </div>
          <span className="font-medium text-panel-surface-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ getValue }) => (
        <span className="line-clamp-1 max-w-xs text-panel-muted-foreground">
          {getValue<string>()}
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
      id: "serviceItemsCount",
      accessorFn: (segment) => segment.serviceItems?.length ?? 0,
      header: "Serviços vinculados",
      cell: ({ row }) => {
        const serviceItems = row.original.serviceItems ?? [];

        return (
          <TooltipComponent
            content={
              serviceItems.length > 0
                ? "Clique para ver os serviços vinculados"
                : "Nenhum serviço vinculado"
            }
            disableHoverableContent
          >
            <button
              type="button"
              onClick={() => onViewServiceItems?.(row.original)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent hover:bg-panel-accent-light hover:text-panel-accent"
            >
              <Link className="size-3.5" />
              {serviceItems.length}
            </button>
          </TooltipComponent>
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
