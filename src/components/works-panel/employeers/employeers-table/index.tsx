"use client";

import { useMemo } from "react";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import type { EmployeerScheduleResponseType } from "@/@type/works-panel/employeer/get-employeer-schedule.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EditEmployeerDialog } from "@/components/works-panel/employeers/edit-employeer-dialog";
import { EmployeerScheduleSheet } from "@/components/works-panel/employeers/employeer-schedule-sheet";
import { SearchEmployeers } from "@/components/works-panel/employeers/search-employeers";
import { useEmployeersTable } from "@/hooks/works-panel/employeer/use-employeers-table";
import { toScheduleSummary } from "@/lib/utils/employeer-schedule";

interface EmployeersTableProps {
  employeers: EmployeerResponseType[];
  /** Agendas pré-carregadas no servidor, indexadas por id do funcionário. */
  schedules: Record<number, EmployeerScheduleResponseType>;
}

export function EmployeersTable({
  employeers,
  schedules,
}: EmployeersTableProps) {
  const summaries = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(schedules).map(([id, schedule]) => [
          Number(id),
          toScheduleSummary(schedule),
        ]),
      ),
    [schedules],
  );

  const {
    search,
    setSearch,
    filteredEmployeers,
    columns,
    deleteDialog,
    editDialog,
    scheduleSheet,
  } = useEmployeersTable({
    employeers,
    schedules: summaries,
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
      <EmployeerScheduleSheet
        schedule={
          scheduleSheet.employeer
            ? (schedules[scheduleSheet.employeer.id] ?? null)
            : null
        }
        open={scheduleSheet.open}
        onOpenChange={scheduleSheet.onOpenChange}
      />

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
