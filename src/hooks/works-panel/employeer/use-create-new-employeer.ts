import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type EmployeerFormData,
  type EmployeerFormOutput,
  employeerSchema,
} from "@/schema/works-panel/employeer/create-new-employeer";

export function useCreateNewEmployeer() {
  const router = useRouter();

  const form = useForm<EmployeerFormData, unknown, EmployeerFormOutput>({
    resolver: zodResolver(employeerSchema),
    defaultValues: {
      name: "",
      dailyRate: "",
    },
  });

  async function createEmployeer(payload: EmployeerFormOutput) {
    const response = await fetch("/api/works-panel/employeer/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar funcionário");
    }

    return response.json();
  }

  async function onSubmit(payload: EmployeerFormOutput) {
    try {
      await toast.promise(createEmployeer(payload), {
        loading: "Cadastrando funcionário...",
        success: "Funcionário cadastrado com sucesso.",
        error: "Não foi possível cadastrar o funcionário.",
      });
      form.reset();
      router.refresh();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<EmployeerFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-employeer-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseCreateNewEmployeerReturn = ReturnType<typeof useCreateNewEmployeer>;
