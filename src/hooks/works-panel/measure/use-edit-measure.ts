"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import {
  type MeasureFormData,
  type MeasureFormOutput,
  measureSchema,
} from "@/schema/works-panel/measure/create-new-measure";

interface UseEditMeasureOptions {
  measure: MeasureResponseType | null;
  onSuccess?: () => void;
}

async function editMeasure(id: number, payload: MeasureFormOutput) {
  const response = await fetch("/api/works-panel/measure/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  if (!response.ok) {
    throw new Error("Falha ao editar medida");
  }

  return response.json();
}

export function useEditMeasure({ measure, onSuccess }: UseEditMeasureOptions) {
  const router = useRouter();

  const form = useForm<MeasureFormData, unknown, MeasureFormOutput>({
    resolver: zodResolver(measureSchema),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  useEffect(() => {
    if (!measure) return;

    form.reset({
      name: measure.name,
      active: measure.active,
    });
  }, [measure, form]);

  async function onSubmit(payload: MeasureFormOutput) {
    if (!measure) return;

    try {
      await toast.promise(editMeasure(measure.id, payload), {
        loading: "Salvando alterações...",
        success: "Medida atualizada com sucesso.",
        error: "Não foi possível atualizar a medida.",
      });
      router.refresh();
      onSuccess?.();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<MeasureFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-measure-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditMeasureReturn = ReturnType<typeof useEditMeasure>;
