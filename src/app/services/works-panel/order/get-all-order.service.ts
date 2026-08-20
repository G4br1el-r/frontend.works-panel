import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { api } from "@/lib/api";

export async function GetAllOrderService() {
  return await api.get<OrderResponseType[]>("/order", {
    cache: "no-store",
    next: { tags: ["orders"] },
  });
}
