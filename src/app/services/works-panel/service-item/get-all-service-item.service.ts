import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { api } from "@/lib/api";

export async function GetAllServiceItemService() {
  return await api.get<ServiceItemResponseType[]>("/service-item", {
    cache: "force-cache",
    next: { tags: ["service-items"] },
  });
}
