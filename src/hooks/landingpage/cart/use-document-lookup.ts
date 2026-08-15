"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { type DocumentLookupFormData, documentLookupSchema } from "@/schema/landingpage/cart/document-lookup-schema";

async function lookupCustomer(document: string) {
  const digits = document.replace(/\D/g, "");
  const response = await fetch(`/api/landingpage/customer/lookup/${digits}`);

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Falha ao consultar seu cadastro");
  }

  return (await response.json()) as CustomerResponseType;
}

interface UseDocumentLookupOptions {
  onFound: (customer: CustomerResponseType) => void;
  onNotFound: (document: string) => void;
}

export function useDocumentLookup({ onFound, onNotFound }: UseDocumentLookupOptions) {
  const form = useForm<DocumentLookupFormData>({
    resolver: zodResolver(documentLookupSchema),
    defaultValues: { document: "" },
  });

  async function onSubmit(data: DocumentLookupFormData) {
    try {
      const customer = await toast.promise(lookupCustomer(data.document), {
        loading: "Consultando seu cadastro...",
        success: (found) => (found ? "Cadastro encontrado!" : "Vamos concluir seu cadastro."),
        error: "Não foi possível consultar seu cadastro.",
      });

      if (customer) {
        onFound(customer);
      } else {
        onNotFound(data.document);
      }
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<DocumentLookupFormData>) {
    toast.error("Confira o documento informado.", {
      id: "document-lookup-error",
    });
  }

  return { form, onSubmit, onInvalid };
}

export type UseDocumentLookupReturn = ReturnType<typeof useDocumentLookup>;
