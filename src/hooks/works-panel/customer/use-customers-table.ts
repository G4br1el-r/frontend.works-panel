"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { createCustomersColumns } from "@/components/works-panel/customers/customers-table/columns";

async function deleteCustomer(id: number) {
  const response = await fetch("/api/works-panel/customer/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    throw new Error("Falha ao excluir cliente");
  }
}

interface UseCustomersTableOptions {
  customers: CustomerResponseType[];
}

export function useCustomersTable({ customers }: UseCustomersTableOptions) {
  const router = useRouter();
  const [customerToDelete, setCustomerToDelete] =
    useState<CustomerResponseType | null>(null);
  const [customerToEdit, setCustomerToEdit] =
    useState<CustomerResponseType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.document.includes(normalizedSearch.replace(/\D/g, "")) ||
        customer.cellPhone.includes(normalizedSearch.replace(/\D/g, "")),
    );
  }, [customers, search]);

  const columns = useMemo(
    () =>
      createCustomersColumns({
        onEdit: (customer) => {
          setCustomerToEdit(customer);
          setIsEditDialogOpen(true);
        },
        onDelete: (customer) => setCustomerToDelete(customer),
      }),
    [],
  );

  async function handleConfirmDelete() {
    if (!customerToDelete) return;

    setIsDeleting(true);

    try {
      await toast.promise(deleteCustomer(customerToDelete.id), {
        loading: "Excluindo cliente...",
        success: "Cliente excluído com sucesso.",
        error: "Não foi possível excluir o cliente.",
      });

      router.refresh();
      setCustomerToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    search,
    setSearch,
    filteredCustomers,
    columns,
    deleteDialog: {
      open: customerToDelete !== null,
      customerName: customerToDelete?.name,
      isLoading: isDeleting,
      onOpenChange: (open: boolean) => !open && setCustomerToDelete(null),
      onConfirm: handleConfirmDelete,
    },
    editDialog: {
      customer: customerToEdit,
      open: isEditDialogOpen,
      onOpenChange: setIsEditDialogOpen,
      onCustomerUpdate: setCustomerToEdit,
    },
  };
}

export type UseCustomersTableReturn = ReturnType<typeof useCustomersTable>;
