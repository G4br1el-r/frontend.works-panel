import type { UnitResponseType } from "@/@type/works-panel/unit/get-unit.type";

export interface MaterialResponseType {
  id: number;
  name: string;
  basePrice: string;
  active: boolean;
  unitId: number | null;
  unit: UnitResponseType | null;
  createdAt: string;
  updatedAt: string;
}
