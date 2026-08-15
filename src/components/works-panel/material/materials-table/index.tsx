"use client";

import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditMaterialDialog } from "@/components/works-panel/material/edit-material-dialog";
import { SearchMaterials } from "@/components/works-panel/material/search-materials";
import { useMaterialsTable } from "@/hooks/works-panel/material/use-materials-table";

interface MaterialsTableProps {
  materials: MaterialResponseType[];
  measures: MeasureResponseType[];
}

export function MaterialsTable({ materials, measures }: MaterialsTableProps) {
  const {
    search,
    setSearch,
    filteredMaterials,
    columns,
    deleteDialog,
    editDialog,
  } = useMaterialsTable({
    materials,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchMaterials value={search} onChange={setSearch} />
        {filteredMaterials.length > 0 ? (
          <DataTable columns={columns} data={filteredMaterials} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhum material encontrado"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir material"
        description={`Tem certeza que deseja excluir ${deleteDialog.materialName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <EditMaterialDialog
        material={editDialog.material}
        measures={measures}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
      />
    </>
  );
}
