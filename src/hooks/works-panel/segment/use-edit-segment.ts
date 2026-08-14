"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import {
  type SegmentFormData,
  type SegmentFormOutput,
  segmentSchema,
} from "@/schema/works-panel/segment/create-new-segment";

interface UseEditSegmentOptions {
  segment: SegmentResponseType | null;
  onSuccess?: () => void;
}

async function editSegment(id: number, payload: SegmentFormOutput) {
  const response = await fetch("/api/works-panel/segment/edit", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });

  if (!response.ok) {
    throw new Error("Falha ao editar segmento");
  }

  return response.json();
}

export function useEditSegment({ segment, onSuccess }: UseEditSegmentOptions) {
  const router = useRouter();

  const form = useForm<SegmentFormData, unknown, SegmentFormOutput>({
    resolver: zodResolver(segmentSchema),
    defaultValues: {
      name: "",
      description: "",
      coverImage: "",
      active: true,
    },
  });

  useEffect(() => {
    if (!segment) return;

    form.reset({
      name: segment.name,
      description: segment.description,
      coverImage: segment.coverImage,
      active: segment.active,
    });
  }, [segment, form]);

  async function onSubmit(payload: SegmentFormOutput) {
    if (!segment) return;

    try {
      await toast.promise(editSegment(segment.id, payload), {
        loading: "Salvando alterações...",
        success: "Segmento atualizado com sucesso.",
        error: "Não foi possível atualizar o segmento.",
      });
      router.refresh();
      onSuccess?.();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<SegmentFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-segment-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseEditSegmentReturn = ReturnType<typeof useEditSegment>;
