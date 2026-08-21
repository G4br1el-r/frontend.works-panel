"use client";

import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { CustomerBudgetsSheet } from "@/components/works-panel/customers/customer-budgets-sheet";
import { EditCustomerDialog } from "@/components/works-panel/customers/edit-customer-dialog";
import { SearchCustomers } from "@/components/works-panel/customers/search-customers";
import { useCustomersTable } from "@/hooks/works-panel/customer/use-customers-table";

interface CustomersTableProps {
  customers: CustomerResponseType[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const {
    search,
    setSearch,
    filteredCustomers,
    columns,
    deleteDialog,
    editDialog,
    budgetsSheet,
  } = useCustomersTable({ customers });

  return (
    <>
      <div className="flex flex-col gap-4">
        <SearchCustomers value={search} onChange={setSearch} />
        {filteredCustomers.length > 0 ? (
          <DataTable columns={columns} data={filteredCustomers} />
        ) : (
          <EmptyState
            icon="searchX"
            title="Nenhum cliente encontrado"
            subtitle={`Não encontramos resultados para "${search.trim()}".`}
          />
        )}
      </div>
      <CustomerBudgetsSheet
        customer={budgetsSheet.customer}
        open={budgetsSheet.open}
        onOpenChange={budgetsSheet.onOpenChange}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={deleteDialog.onOpenChange}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir ${deleteDialog.customerName}? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        variant="destructive"
        isLoading={deleteDialog.isLoading}
        onConfirm={deleteDialog.onConfirm}
      />
      <EditCustomerDialog
        customer={editDialog.customer}
        open={editDialog.open}
        onOpenChange={editDialog.onOpenChange}
        onCustomerUpdate={editDialog.onCustomerUpdate}
      />
    </>
  );
}
