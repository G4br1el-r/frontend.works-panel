"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import {
  type MaterialFormData,
  type MaterialFormOutput,
  materialSchema,
} from "@/schema/works-panel/material/create-new-material";

function formatBasePriceForInput(basePrice: number | string) {
  const value = typeof basePrice === "number" ? basePrice : Number(basePrice);
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface UseEditMaterialOptions {
  material: MaterialResponseType | null;
  onSuccess?: () => void;
}

async function editMaterial(id: number, payload: MaterialFormOutput) {
  const response = await fetch("/api/works-panel/material/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  if (!response.ok) {
    throw new Error("Falha ao editar material");
  }

  return response.json();
}

export function useEditMaterial({
  material,
  onSuccess,
}: UseEditMaterialOptions) {
  const router = useRouter();

  const form = useForm<MaterialFormData, unknown, MaterialFormOutput>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: "",
      basePrice: "",
      active: true,
      measureId: null,
    },
  });

  useEffect(() => {
    if (!material) return;

    form.reset({
      name: material.name,
      basePrice: formatBasePriceForInput(material.basePrice),
      active: material.active,
      measureId: material.measureId,
    });
  }, [material, form]);

  async function onSubmit(payload: MaterialFormOutput) {
    if (!material) return;

    try {
      await toast.promise(editMaterial(material.id, payload), {
        loading: "Salvando alterações...",
        success: "Material atualizado com sucesso.",
        error: "Não foi possível atualizar o material.",
      });
      router.refresh();
      onSuccess?.();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<MaterialFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-material-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditMaterialReturn = ReturnType<typeof useEditMaterial>;
