"use client";

import { SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { EmployeerResponseData } from "@/@type/works-panel/employeer/get-employeer.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EditEmployeerDialog } from "@/components/works-panel/employeers/edit-employeer-dialog";
import { createEmployeersColumns } from "@/components/works-panel/employeers/employeers-table/columns";
import { EmptyEmployeers } from "@/components/works-panel/employeers/empty-employeers";
import { SearchEmployeers } from "@/components/works-panel/employeers/search-employeers";

interface EmployeersTableProps {
  employeers: EmployeerResponseData[];
}

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

export function EmployeersTable({ employeers }: EmployeersTableProps) {
  const router = useRouter();
  const [employeerToDelete, setEmployeerToDelete] =
    useState<EmployeerResponseData | null>(null);
  const [employeerToEdit, setEmployeerToEdit] =
    useState<EmployeerResponseData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

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
      }),
    [],
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

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchEmployeers value={search} onChange={setSearch} />
        {filteredEmployeers.length > 0 ? (
          <DataTable columns={columns} data={filteredEmployeers} />
        ) : (
          <EmptyEmployeers
            icon={SearchX}
            title="Nenhum funcionário encontrado"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <ConfirmDialog
        open={employeerToDelete !== null}
        onOpenChange={(open) => !open && setEmployeerToDelete(null)}
        title="Excluir funcionário"
        description={`Tem certeza que deseja excluir ${employeerToDelete?.name}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
      <EditEmployeerDialog
        employeer={employeerToEdit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
