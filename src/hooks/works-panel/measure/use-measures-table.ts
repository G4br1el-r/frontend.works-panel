"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { createMeasuresColumns } from "@/components/works-panel/measure/measures-table/columns";

async function deleteMeasure(id: number) {
  const response = await fetch("/api/works-panel/measure/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir medida");
  }
}

interface UseMeasuresTableOptions {
  measures: MeasureResponseType[];
}

export function useMeasuresTable({ measures }: UseMeasuresTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [measureToDelete, setMeasureToDelete] =
    useState<MeasureResponseType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [measureToEdit, setMeasureToEdit] =
    useState<MeasureResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredMeasures = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return measures;

    return measures.filter((measure) =>
      measure.name.toLowerCase().includes(normalizedSearch),
    );
  }, [measures, search]);

  const columns = useMemo(
    () =>
      createMeasuresColumns({
        onEdit: (measure) => {
          setMeasureToEdit(measure);
          setIsEditDialogOpen(true);
        },
        onDelete: (measure) => setMeasureToDelete(measure),
      }),
    [],
  );

  async function handleConfirmDelete() {
    if (!measureToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteMeasure(measureToDelete.id), {
        loading: "Excluindo medida...",
        success: "Medida excluída com sucesso.",
        error: "Não foi possível excluir a medida.",
      });

      router.refresh();
      setMeasureToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    search,
    setSearch,
    filteredMeasures,
    columns,
    deleteDialog: {
      open: measureToDelete !== null,
      measureName: measureToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setMeasureToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    editDialog: {
      measure: measureToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
    },
  };
}

export type UseMeasuresTableReturn = ReturnType<typeof useMeasuresTable>;
