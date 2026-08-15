"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { createServiceItemsColumns } from "@/components/works-panel/service-item/service-items-table/columns";

async function deleteServiceItem(id: number) {
  const response = await fetch("/api/works-panel/service-item/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir serviço");
  }
}

interface UseServiceItemsTableOptions {
  serviceItems: ServiceItemResponseType[];
}

export function useServiceItemsTable({
  serviceItems,
}: UseServiceItemsTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [serviceItemToDelete, setServiceItemToDelete] =
    useState<ServiceItemResponseType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceItemToEdit, setServiceItemToEdit] =
    useState<ServiceItemResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [serviceItemToViewMaterials, setServiceItemToViewMaterials] =
    useState<ServiceItemResponseType | null>(null);

  const filteredServiceItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return serviceItems;

    return serviceItems.filter((serviceItem) =>
      serviceItem.name.toLowerCase().includes(normalizedSearch),
    );
  }, [serviceItems, search]);

  const columns = useMemo(
    () =>
      createServiceItemsColumns({
        onEdit: (serviceItem) => {
          setServiceItemToEdit(serviceItem);
          setIsEditDialogOpen(true);
        },
        onDelete: (serviceItem) => setServiceItemToDelete(serviceItem),
        onViewMaterials: (serviceItem) =>
          setServiceItemToViewMaterials(serviceItem),
      }),
    [],
  );

  async function handleConfirmDelete() {
    if (!serviceItemToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteServiceItem(serviceItemToDelete.id), {
        loading: "Excluindo serviço...",
        success: "Serviço excluído com sucesso.",
        error: "Não foi possível excluir o serviço.",
      });

      router.refresh();
      setServiceItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    search,
    setSearch,
    filteredServiceItems,
    columns,
    deleteDialog: {
      open: serviceItemToDelete !== null,
      serviceItemName: serviceItemToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setServiceItemToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    editDialog: {
      serviceItem: serviceItemToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
    },
    viewMaterialsDialog: {
      serviceItem: serviceItemToViewMaterials,
      open: serviceItemToViewMaterials !== null,
      onOpenChange: (open: boolean) =>
        !open && setServiceItemToViewMaterials(null),
    },
  };
}

export type UseServiceItemsTableReturn = ReturnType<
  typeof useServiceItemsTable
>;
