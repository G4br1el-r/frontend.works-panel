"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { createSegmentsColumns } from "@/components/works-panel/segment/segments-table/columns";

async function deleteSegment(segment: SegmentResponseType) {
  const response = await fetch("/api/works-panel/segment/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: segment.id, coverImage: segment.coverImage }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir segmento");
  }
}

interface UseSegmentsTableOptions {
  segments: SegmentResponseType[];
}

export function useSegmentsTable({ segments }: UseSegmentsTableOptions) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [segmentToViewServiceItems, setSegmentToViewServiceItems] =
    useState<SegmentResponseType | null>(null);
  const [segmentToDelete, setSegmentToDelete] =
    useState<SegmentResponseType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [segmentToEdit, setSegmentToEdit] =
    useState<SegmentResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredSegments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return segments;

    return segments.filter((segment) =>
      segment.name.toLowerCase().includes(normalizedSearch),
    );
  }, [segments, search]);

  const columns = useMemo(
    () =>
      createSegmentsColumns({
        onEdit: (segment) => {
          setSegmentToEdit(segment);
          setIsEditDialogOpen(true);
        },
        onDelete: (segment) => setSegmentToDelete(segment),
        onViewServiceItems: (segment) => setSegmentToViewServiceItems(segment),
      }),
    [],
  );

  async function handleConfirmDelete() {
    if (!segmentToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteSegment(segmentToDelete), {
        loading: "Excluindo segmento...",
        success: "Segmento excluído com sucesso.",
        error: "Não foi possível excluir o segmento.",
      });

      router.refresh();
      setSegmentToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    search,
    setSearch,
    filteredSegments,
    columns,
    deleteDialog: {
      open: segmentToDelete !== null,
      segmentName: segmentToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setSegmentToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    viewServiceItemsDialog: {
      segment: segmentToViewServiceItems,
      open: segmentToViewServiceItems !== null,
      onOpenChange: (open: boolean) =>
        !open && setSegmentToViewServiceItems(null),
    },
    editDialog: {
      segment: segmentToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
    },
  };
}

export type UseSegmentsTableReturn = ReturnType<typeof useSegmentsTable>;
