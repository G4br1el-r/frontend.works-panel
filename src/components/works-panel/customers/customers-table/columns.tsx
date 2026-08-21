"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { FileText, MapPin, Pencil, Trash2 } from "lucide-react";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { TooltipComponent } from "@/components/shared/tooltip-component";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils/format-date";

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

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return value;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getInitials(name: string) {
  const [first, second] = name.trim().split(/\s+/);
  return `${first?.[0] ?? ""}${second?.[0] ?? ""}`.toUpperCase();
}

interface CreateCustomersColumnsOptions {
  onEdit?: (customer: CustomerResponseType) => void;
  onDelete?: (customer: CustomerResponseType) => void;
  onViewBudgets?: (customer: CustomerResponseType) => void;
}

export function createCustomersColumns({
  onEdit,
  onDelete,
  onViewBudgets,
}: CreateCustomersColumnsOptions): ColumnDef<CustomerResponseType>[] {
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
      accessorKey: "document",
      header: "CPF/CNPJ",
      cell: ({ row }) => (
        <span className="text-panel-muted-foreground">
          {formatDocument(row.original.document)}
        </span>
      ),
    },
    {
      accessorKey: "cellPhone",
      header: "Celular",
      cell: ({ row }) => (
        <span className="text-panel-muted-foreground">
          {formatPhone(row.original.cellPhone)}
        </span>
      ),
    },
    {
      id: "addresses",
      accessorFn: (customer) => customer.addresses.length,
      header: "Endereços",
      cell: ({ row, getValue }) => (
        <TooltipComponent
          content="Clique para ver os endereços"
          disableHoverableContent
        >
          <button
            type="button"
            onClick={() => onEdit?.(row.original)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-panel-border bg-panel-page px-2 py-0.5 text-xs font-medium text-panel-surface-foreground transition-colors hover:border-panel-accent hover:bg-panel-accent-light hover:text-panel-accent"
          >
            <MapPin className="size-3.5" />
            {getValue<number>()}
          </button>
        </TooltipComponent>
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
          <TooltipComponent content="Ver orçamentos" disableHoverableContent>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer text-panel-muted-foreground hover:bg-sidebar-accent hover:text-panel-accent!"
              onClick={() => onViewBudgets?.(row.original)}
            >
              <FileText className="size-4" />
              <span className="sr-only">
                Ver orçamentos de {row.original.name}
              </span>
            </Button>
          </TooltipComponent>
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
