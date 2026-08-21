"use client";

import {
  type Cell,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type RowData,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { DEFAULT_EASE } from "@/components/motion/variants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type DataTableColumnAlign = "left" | "center" | "right";

declare module "@tanstack/react-table" {
  // biome-ignore lint/correctness/noUnusedVariables: required by the ColumnMeta augmentation signature
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: DataTableColumnAlign;
  }
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  pageSize?: number;
  /** Classe extra por linha — para estados como cancelado/inativo. */
  rowClassName?: (row: TData) => string | undefined;
  /**
   * Largura mínima da tabela (ex: "56rem"). Abaixo disso a área rola na
   * horizontal em vez de espremer as colunas; a paginação fica fora do scroll.
   */
  minWidth?: string;
}

const ALIGN_TEXT_CLASS: Record<DataTableColumnAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const ALIGN_JUSTIFY_CLASS: Record<DataTableColumnAlign, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

const ROWS_CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const ROW_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: DEFAULT_EASE },
  },
};

export function DataTable<TData>({
  columns,
  data,
  pageSize = 10,
  rowClassName,
  minWidth,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize });

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — resets to page 1 whenever the data set changes (filter, refresh, etc), not on every render
  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const rows = table.getRowModel().rows;

  const paginationControls = pageCount > 1 && (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-panel-muted-foreground text-xs">
        Página {pageIndex + 1} de {pageCount}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer border border-panel-border text-panel-muted-foreground hover:bg-sidebar-accent hover:text-panel-surface-foreground!"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Página anterior</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="cursor-pointer border border-panel-border text-panel-muted-foreground hover:bg-sidebar-accent hover:text-panel-surface-foreground!"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRight className="size-4" />
          <span className="sr-only">Próxima página</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Tabela — telas médias pra cima */}
      <div className="hidden overflow-hidden rounded-lg border border-panel-border md:block">
        <div
          className={cn(
            minWidth && "data-table-scroll overflow-x-auto overflow-y-hidden",
          )}
        >
          <table
            className="w-full text-sm"
            style={minWidth ? { minWidth } : undefined}
          >
            <thead className="bg-panel-page/60">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    const align = header.column.columnDef.meta?.align ?? "left";

                    return (
                      <th key={header.id} className={ALIGN_TEXT_CLASS[align]}>
                        {canSort ? (
                          <button
                            type="button"
                            onClick={header.column.getToggleSortingHandler()}
                            className={cn(
                              "flex w-full cursor-pointer items-center gap-1 px-4 py-3 font-medium text-panel-muted-foreground transition-colors hover:text-panel-surface-foreground",
                              ALIGN_JUSTIFY_CLASS[align],
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {sortDirection === "asc" && (
                              <ArrowUp className="size-2.5" strokeWidth={2.5} />
                            )}
                            {sortDirection === "desc" && (
                              <ArrowDown
                                className="size-2.5"
                                strokeWidth={2.5}
                              />
                            )}
                          </button>
                        ) : (
                          <div
                            className={cn(
                              "px-4 py-3 font-medium text-panel-muted-foreground",
                              ALIGN_TEXT_CLASS[align],
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <motion.tbody
              key={pageIndex}
              className="divide-y divide-panel-border"
              variants={ROWS_CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
            >
              {rows.map((row) => (
                <motion.tr
                  key={row.id}
                  variants={ROW_VARIANTS}
                  className={cn(
                    "transition-colors hover:bg-panel-page/40",
                    rowClassName?.(row.original),
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align ?? "left";

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 py-3 text-panel-surface-foreground",
                          ALIGN_TEXT_CLASS[align],
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {paginationControls && (
          <div className="border-t border-panel-border">
            {paginationControls}
          </div>
        )}
      </div>

      {/* Cards — telas pequenas */}
      <motion.div
        key={pageIndex}
        className="flex flex-col gap-3 md:hidden"
        variants={ROWS_CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
      >
        {rows.map((row) => (
          <DataTableCard
            key={row.id}
            row={row}
            className={rowClassName?.(row.original)}
          />
        ))}
      </motion.div>

      {paginationControls && (
        <div className="rounded-lg border border-panel-border md:hidden">
          {paginationControls}
        </div>
      )}
    </div>
  );
}

function DataTableCard<TData>({
  row,
  className,
}: {
  row: Row<TData>;
  className?: string;
}) {
  const cells = row.getVisibleCells();
  const [titleCell, ...restCells] = cells;
  const actionCell = restCells.find(
    (cell) => cell.column.columnDef.meta?.align === "center",
  );
  const detailCells = restCells.filter((cell) => cell !== actionCell);

  return (
    <motion.div
      variants={ROW_VARIANTS}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-panel-border bg-panel-surface p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-panel-surface-foreground text-sm">
          {titleCell &&
            flexRender(titleCell.column.columnDef.cell, titleCell.getContext())}
        </span>
        {actionCell &&
          flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
      </div>
      <dl className="flex flex-col gap-1.5">
        {detailCells.map((cell) => (
          <CardDetailRow key={cell.id} cell={cell} />
        ))}
      </dl>
    </motion.div>
  );
}

function CardDetailRow<TData>({ cell }: { cell: Cell<TData, unknown> }) {
  const header = cell.column.columnDef.header;
  const headerLabel = typeof header === "string" ? header : cell.column.id;

  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <dt className="text-panel-muted-foreground">{headerLabel}</dt>
      <dd className="text-panel-surface-foreground">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </dd>
    </div>
  );
}
