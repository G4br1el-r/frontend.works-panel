import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";

export interface SegmentResponseType {
  id: number;
  name: string;
  description: string;
  coverImage: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  serviceItems?: ServiceItemResponseType[];
}
