import type { EmployeerResponseData } from "@/@type/works-panel/employeer/get-employeer.type";
import { api } from "@/lib/api";

export async function GetAllEmployeerService() {
  return await api.get<EmployeerResponseData[]>("/employeer", {
    next: { tags: ["employeers"] },
  });
}
