import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import { api } from "@/lib/api";

export async function GetAllMaterialService() {
  return await api.get<MaterialResponseType[]>("/material", {
    cache: "force-cache",
    next: { tags: ["materials"] },
  });
}
