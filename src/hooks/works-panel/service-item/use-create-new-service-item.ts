import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  type ServiceItemFormData,
  type ServiceItemFormOutput,
  serviceItemSchema,
} from "@/schema/works-panel/service-item/create-new-service-item";

export function useCreateNewServiceItem() {
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

  async function createServiceItem(payload: ServiceItemFormOutput) {
    const response = await fetch("/api/works-panel/service-item/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Falha ao cadastrar serviço");
    }

    return response.json();
  }

  async function onSubmit(payload: ServiceItemFormOutput) {
    try {
      await toast.promise(createServiceItem(payload), {
        loading: "Cadastrando serviço...",
        success: "Serviço cadastrado com sucesso.",
        error: "Não foi possível cadastrar o serviço.",
      });
      form.reset();
      router.refresh();
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<ServiceItemFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-service-item-error",
    });
  }

  return { onSubmit, onInvalid, form };
}

export type UseCreateNewServiceItemReturn = ReturnType<
  typeof useCreateNewServiceItem
>;
