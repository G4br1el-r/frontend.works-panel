"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { createMaterialsColumns } from "@/components/works-panel/material/materials-table/columns";

async function deleteMaterial(id: number) {
  const response = await fetch("/api/works-panel/material/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir material");
  }
}

interface UseMaterialsTableOptions {
  materials: MaterialResponseType[];
}

export function useMaterialsTable({ materials }: UseMaterialsTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [materialToDelete, setMaterialToDelete] =
    useState<MaterialResponseType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [materialToEdit, setMaterialToEdit] =
    useState<MaterialResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredMaterials = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return materials;

    return materials.filter((material) =>
      material.name.toLowerCase().includes(normalizedSearch),
    );
  }, [materials, search]);

  const columns = useMemo(
    () =>
      createMaterialsColumns({
        onEdit: (material) => {
          setMaterialToEdit(material);
          setIsEditDialogOpen(true);
        },
        onDelete: (material) => setMaterialToDelete(material),
      }),
    [],
  );

  async function handleConfirmDelete() {
    if (!materialToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteMaterial(materialToDelete.id), {
        loading: "Excluindo material...",
        success: "Material excluído com sucesso.",
        error: "Não foi possível excluir o material.",
      });

      router.refresh();
      setMaterialToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    search,
    setSearch,
    filteredMaterials,
    columns,
    deleteDialog: {
      open: materialToDelete !== null,
      materialName: materialToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setMaterialToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    editDialog: {
      material: materialToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
    },
  };
}

export type UseMaterialsTableReturn = ReturnType<typeof useMaterialsTable>;
