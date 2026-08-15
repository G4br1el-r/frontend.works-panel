import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type MeasureFormData,
  type MeasureFormOutput,
  measureSchema,
} from "@/schema/works-panel/measure/create-new-measure";

export function useCreateNewMeasure() {
  const router = useRouter();

  const form = useForm<MeasureFormData, unknown, MeasureFormOutput>({
    resolver: zodResolver(measureSchema),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  async function createMeasure(payload: MeasureFormOutput) {
    const response = await fetch("/api/works-panel/measure/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar medida");
    }

    return response.json();
  }

  async function onSubmit(payload: MeasureFormOutput) {
    try {
      await toast.promise(createMeasure(payload), {
        loading: "Cadastrando medida...",
        success: "Medida cadastrada com sucesso.",
        error: "Não foi possível cadastrar a medida.",
      });
      form.reset();
      router.refresh();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<MeasureFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-measure-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseCreateNewMeasureReturn = ReturnType<typeof useCreateNewMeasure>;
