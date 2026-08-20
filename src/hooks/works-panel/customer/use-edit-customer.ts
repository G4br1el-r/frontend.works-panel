"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import {
  type CustomerFormData,
  type CustomerFormOutput,
  customerSchema,
} from "@/schema/works-panel/customer/edit-customer";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

interface UseEditCustomerOptions {
  customer: CustomerResponseType | null;
  onSuccess?: () => void;
}

class EditCustomerError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function editCustomer(id: number, payload: CustomerFormOutput) {
  const response = await fetch("/api/works-panel/customer/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      name: payload.name,
      cellPhone: onlyDigits(payload.cellPhone),
      document: onlyDigits(payload.document),
      email: payload.email,
      observation: payload.observation,
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new EditCustomerError(
      body?.message ?? "Falha ao editar cliente",
      body?.code,
    );
  }

  return response.json();
}

export function useEditCustomer({
  customer,
  onSuccess,
}: UseEditCustomerOptions) {
  const router = useRouter();

  const form = useForm<CustomerFormData, unknown, CustomerFormOutput>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      cellPhone: "",
      document: "",
      email: "",
      observation: "",
    },
  });

  useEffect(() => {
    if (!customer) return;

    form.reset({
      name: customer.name,
      cellPhone: customer.cellPhone,
      document: customer.document,
      email: customer.email ?? "",
      observation: customer.observation ?? "",
    });
  }, [customer, form]);

  async function onSubmit(payload: CustomerFormOutput) {
    if (!customer) return;

    try {
      await toast.promise(editCustomer(customer.id, payload), {
        loading: "Salvando alterações...",
        success: "Cliente atualizado com sucesso.",
        error: (error) => {
          if (!(error instanceof EditCustomerError)) {
            return "Não foi possível atualizar o cliente.";
          }
          if (error.code === "CONFLICT") {
            return "Já existe um cliente com esse CPF/CNPJ.";
          }
          return error.message;
        },
      });
      router.refresh();
      onSuccess?.();
    } catch (error) {
      if (error instanceof EditCustomerError && error.code === "CONFLICT") {
        form.setError("document", {
          type: "manual",
          message: "Já existe um cliente com esse CPF/CNPJ.",
        });
      }
    }
  }

  function onInvalid(_errors: FieldErrors<CustomerFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-customer-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditCustomerReturn = ReturnType<typeof useEditCustomer>;
