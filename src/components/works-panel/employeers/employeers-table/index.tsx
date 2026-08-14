"use client";

import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditEmployeerDialog } from "@/components/works-panel/employeers/edit-employeer-dialog";
import { SearchEmployeers } from "@/components/works-panel/employeers/search-employeers";
import { useEmployeersTable } from "@/hooks/works-panel/employeer/use-employeers-table";

interface EmployeersTableProps {
  employeers: EmployeerResponseType[];
}

export function EmployeersTable({ employeers }: EmployeersTableProps) {
  const { search, setSearch, filteredEmployeers, columns, deleteDialog, editDialog } = useEmployeersTable({
    employeers,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchEmployeers value={search} onChange={setSearch} />
        {filteredEmployeers.length > 0 ? (
          <DataTable columns={columns} data={filteredEmployeers} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhum funcionário encontrado"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir funcionário"
        description={`Tem certeza que deseja excluir ${deleteDialog.employeerName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <EditEmployeerDialog
        employeer={editDialog.employeer}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
      />
    </>
  );
}
