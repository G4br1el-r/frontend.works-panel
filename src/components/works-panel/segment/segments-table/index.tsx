"use client";

import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditSegmentDialog } from "@/components/works-panel/segment/edit-segment-dialog";
import { SearchSegments } from "@/components/works-panel/segment/search-segments";
import { SegmentServiceItemsDialog } from "@/components/works-panel/segment/segment-service-items-dialog";
import { useSegmentsTable } from "@/hooks/works-panel/segment/use-segments-table";

interface SegmentsTableProps {
  segments: SegmentResponseType[];
}

export function SegmentsTable({ segments }: SegmentsTableProps) {
  const {
    search,
    setSearch,
    filteredSegments,
    columns,
    deleteDialog,
    viewServiceItemsDialog,
    editDialog,
  } = useSegmentsTable({
    segments,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchSegments value={search} onChange={setSearch} />
        {filteredSegments.length > 0 ? (
          <DataTable columns={columns} data={filteredSegments} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhum segmento encontrado"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir segmento"
        description={`Tem certeza que deseja excluir ${deleteDialog.segmentName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <SegmentServiceItemsDialog
        segment={viewServiceItemsDialog.segment}
        open={viewServiceItemsDialog.open}
        onOpenChange={viewServiceItemsDialog.onOpenChange}
      />
      <EditSegmentDialog
        segment={editDialog.segment}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
      />
    </>
  );
}
