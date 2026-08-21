"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { createEmployeersColumns } from "@/components/works-panel/employeers/employeers-table/columns";
import type { EmployeerScheduleSummary } from "@/lib/utils/employeer-schedule";

async function deleteEmployeer(id: number) {
  const response = await fetch("/api/works-panel/employeer/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir funcionário");
  }
}

interface UseEmployeersTableOptions {
  employeers: EmployeerResponseType[];
  schedules?: Record<number, EmployeerScheduleSummary>;
}

export function useEmployeersTable({
  employeers,
  schedules,
}: UseEmployeersTableOptions) {
  const router = useRouter();
  const [employeerToDelete, setEmployeerToDelete] =
    useState<EmployeerResponseType | null>(null);
  const [employeerToEdit, setEmployeerToEdit] =
    useState<EmployeerResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [employeerToViewSchedule, setEmployeerToViewSchedule] =
    useState<EmployeerResponseType | null>(null);

  const filteredEmployeers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return employeers;

    return employeers.filter((employeer) =>
      employeer.name.toLowerCase().includes(normalizedSearch),
    );
  }, [employeers, search]);

  const columns = useMemo(
    () =>
      createEmployeersColumns({
        onEdit: (employeer) => {
          setEmployeerToEdit(employeer);
          setIsEditDialogOpen(true);
        },
        onDelete: (employeer) => setEmployeerToDelete(employeer),
        onViewSchedule: setEmployeerToViewSchedule,
        schedules,
      }),
    [schedules],
  );

  async function handleConfirmDelete() {
    if (!employeerToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteEmployeer(employeerToDelete.id), {
        loading: "Excluindo funcionário...",
        success: "Funcionário excluído com sucesso.",
        error: "Não foi possível excluir o funcionário.",
      });

      router.refresh();
      setEmployeerToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    scheduleSheet: {
      open: employeerToViewSchedule !== null,
      employeer: employeerToViewSchedule,
      onOpenChange: (open: boolean) =>
        !open && setEmployeerToViewSchedule(null),
    },
    search,
    setSearch,
    filteredEmployeers,
    columns,
    deleteDialog: {
      open: employeerToDelete !== null,
      employeerName: employeerToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setEmployeerToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    editDialog: {
      employeer: employeerToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
    },
  };
}

export type UseEmployeersTableReturn = ReturnType<typeof useEmployeersTable>;
