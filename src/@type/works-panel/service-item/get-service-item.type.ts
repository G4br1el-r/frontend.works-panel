import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { UnitResponseType } from "@/@type/works-panel/unit/get-unit.type";

export interface ServiceItemResponseType {
  id: number;
  name: string;
  basePrice: string;
  active: boolean;
  unitId: number | null;
  unit: UnitResponseType | null;
  segmentId: number | null;
  materials: MaterialResponseType[];
  createdAt: string;
  updatedAt: string;
}
