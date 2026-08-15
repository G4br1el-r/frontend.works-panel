"use client";

import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditMeasureDialog } from "@/components/works-panel/measure/edit-measure-dialog";
import { SearchMeasures } from "@/components/works-panel/measure/search-measures";
import { useMeasuresTable } from "@/hooks/works-panel/measure/use-measures-table";

interface MeasuresTableProps {
  measures: MeasureResponseType[];
}

export function MeasuresTable({ measures }: MeasuresTableProps) {
  const {
    search,
    setSearch,
    filteredMeasures,
    columns,
    deleteDialog,
    editDialog,
  } = useMeasuresTable({
    measures,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchMeasures value={search} onChange={setSearch} />
        {filteredMeasures.length > 0 ? (
          <DataTable columns={columns} data={filteredMeasures} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhuma medida encontrada"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir medida"
        description={`Tem certeza que deseja excluir ${deleteDialog.measureName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <EditMeasureDialog
        measure={editDialog.measure}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
      />
    </>
  );
}
