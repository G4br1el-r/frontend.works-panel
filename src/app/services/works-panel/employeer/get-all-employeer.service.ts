import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { api } from "@/lib/api";

export async function GetAllEmployeerService() {
  return await api.get<EmployeerResponseType[]>("/employeer", {
    next: { tags: ["employeers"] },
  });
}
