"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import {
  type ServiceItemFormData,
  type ServiceItemFormOutput,
  serviceItemSchema,
} from "@/schema/works-panel/service-item/create-new-service-item";

function formatBasePriceForInput(basePrice: number | string) {
  const value = typeof basePrice === "number" ? basePrice : Number(basePrice);
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface UseEditServiceItemOptions {
  serviceItem: ServiceItemResponseType | null;
  onSuccess?: () => void;
}

async function editServiceItem(id: number, payload: ServiceItemFormOutput) {
  const response = await fetch("/api/works-panel/service-item/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  if (!response.ok) {
    throw new Error("Falha ao editar serviço");
  }

  return response.json();
}

export function useEditServiceItem({
  serviceItem,
  onSuccess,
}: UseEditServiceItemOptions) {
  const router = useRouter();

  const form = useForm<ServiceItemFormData, unknown, ServiceItemFormOutput>({
    resolver: zodResolver(serviceItemSchema),
    defaultValues: {
      name: "",
      basePrice: "",
      active: true,
      measureId: null,
      segmentId: null,
      materialIds: [],
    },
  });

  useEffect(() => {
    if (!serviceItem) return;

    form.reset({
      name: serviceItem.name,
      basePrice: formatBasePriceForInput(serviceItem.basePrice),
      active: serviceItem.active,
      measureId: serviceItem.measureId,
      segmentId: serviceItem.segmentId,
      materialIds: serviceItem.materials.map((material) => material.id),
    });
  }, [serviceItem, form]);

  async function onSubmit(payload: ServiceItemFormOutput) {
    if (!serviceItem) return;

    try {
      await toast.promise(editServiceItem(serviceItem.id, payload), {
        loading: "Salvando alterações...",
        success: "Serviço atualizado com sucesso.",
        error: "Não foi possível atualizar o serviço.",
      });
      router.refresh();
      onSuccess?.();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<ServiceItemFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-service-item-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditServiceItemReturn = ReturnType<typeof useEditServiceItem>;
