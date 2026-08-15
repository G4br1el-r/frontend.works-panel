import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type MaterialFormData,
  type MaterialFormOutput,
  materialSchema,
} from "@/schema/works-panel/material/create-new-material";

export function useCreateNewMaterial() {
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

  async function createMaterial(payload: MaterialFormOutput) {
    const response = await fetch("/api/works-panel/material/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar material");
    }

    return response.json();
  }

  async function onSubmit(payload: MaterialFormOutput) {
    try {
      await toast.promise(createMaterial(payload), {
        loading: "Cadastrando material...",
        success: "Material cadastrado com sucesso.",
        error: "Não foi possível cadastrar o material.",
      });
      form.reset();
      router.refresh();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<MaterialFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-material-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseCreateNewMaterialReturn = ReturnType<
  typeof useCreateNewMaterial
>;
