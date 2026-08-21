"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import {
  type EmployeerFormData,
  type EmployeerFormOutput,
  employeerSchema,
} from "@/schema/works-panel/employeer/create-new-employeer";

function formatDailyRateForInput(dailyRate: number | string) {
  const value = typeof dailyRate === "number" ? dailyRate : Number(dailyRate);
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface UseEditEmployeerOptions {
  employeer: EmployeerResponseType | null;
  onSuccess?: () => void;
}

async function editEmployeer(id: number, payload: EmployeerFormOutput) {
  const response = await fetch("/api/works-panel/employeer/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  if (!response.ok) {
    throw new Error("Falha ao editar funcionário");
  }

  return response.json();
}

export function useEditEmployeer({
  employeer,
  onSuccess,
}: UseEditEmployeerOptions) {
  const router = useRouter();

  const form = useForm<EmployeerFormData, unknown, EmployeerFormOutput>({
    resolver: zodResolver(employeerSchema),
    defaultValues: { name: "", dailyRate: "" },
  });

  useEffect(() => {
    if (!employeer) return;

    form.reset({
      name: employeer.name,
      dailyRate: formatDailyRateForInput(employeer.dailyRate),
    });
  }, [employeer, form]);

  async function onSubmit(payload: EmployeerFormOutput) {
    if (!employeer) return;

    try {
      await toast.promise(editEmployeer(employeer.id, payload), {
        loading: "Salvando alterações...",
        success: "Funcionário atualizado com sucesso.",
        error: "Não foi possível atualizar o funcionário.",
      });
      router.refresh();
      onSuccess?.();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<EmployeerFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-employeer-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditEmployeerReturn = ReturnType<typeof useEditEmployeer>;
