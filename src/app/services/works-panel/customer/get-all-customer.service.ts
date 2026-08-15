import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import { api } from "@/lib/api";

export async function GetAllCustomerService() {
  return await api.get<CustomerResponseType[]>("/customer", {
    cache: "force-cache",
    next: { tags: ["customers"] },
  });
}
