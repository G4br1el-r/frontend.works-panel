"use client";

import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditServiceItemDialog } from "@/components/works-panel/service-item/edit-service-item-dialog";
import { SearchServiceItems } from "@/components/works-panel/service-item/search-service-items";
import { ServiceItemMaterialsDialog } from "@/components/works-panel/service-item/service-item-materials-dialog";
import { ServiceItemsFilterSheet } from "@/components/works-panel/service-item/service-items-filter-sheet";
import { useServiceItemsTable } from "@/hooks/works-panel/service-item/use-service-items-table";

interface ServiceItemsTableProps {
  serviceItems: ServiceItemResponseType[];
  measures: MeasureResponseType[];
  segments: SegmentResponseType[];
  materials: MaterialResponseType[];
}

export function ServiceItemsTable({
  serviceItems,
  measures,
  segments,
  materials,
}: ServiceItemsTableProps) {
  const {
    search,
    setSearch,
    filters,
    filteredServiceItems,
    columns,
    deleteDialog,
    editDialog,
    viewMaterialsDialog,
  } = useServiceItemsTable({
    serviceItems,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <SearchServiceItems value={search} onChange={setSearch} />
          </div>
          <ServiceItemsFilterSheet
            filters={filters}
            segments={segments}
            measures={measures}
          />
        </div>
        {filteredServiceItems.length > 0 ? (
          <DataTable columns={columns} data={filteredServiceItems} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhum serviço encontrado"
            subtitle={
              search.trim()
                ? `Não encontramos resultados para "${search.trim()}".`
                : "Nenhum serviço corresponde aos filtros selecionados."
            }
          />
        )}
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir serviço"
        description={`Tem certeza que deseja excluir ${deleteDialog.serviceItemName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <EditServiceItemDialog
        serviceItem={editDialog.serviceItem}
        measures={measures}
        segments={segments}
        materials={materials}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
      />
      <ServiceItemMaterialsDialog
        serviceItem={viewMaterialsDialog.serviceItem}
        open={viewMaterialsDialog.open}
        onOpenChange={viewMaterialsDialog.onOpenChange}
      />
    </>
  );
}
