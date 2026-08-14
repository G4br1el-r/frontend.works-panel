import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { EmployeerFormData } from "@/schema/works-panel/employeer/create-new-employeer";
import {
  type SegmentFormData,
  type SegmentFormOutput,
  segmentSchema,
} from "@/schema/works-panel/segment/create-new-segment";

export function useCreateNewSegment() {
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

  async function createSegment(payload: SegmentFormOutput) {
    const response = await fetch("/api/works-panel/segment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar segmento");
    }

    return response.json();
  }

  async function onSubmit(payload: SegmentFormOutput) {
    try {
      await toast.promise(createSegment(payload), {
        loading: "Cadastrando segmento...",
        success: "Segmento cadastrado com sucesso.",
        error: "Não foi possível cadastrar o segmento.",
      });
      form.reset();
      router.refresh();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<EmployeerFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-segment-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseCreateNewSegmentReturn = ReturnType<typeof useCreateNewSegment>;
