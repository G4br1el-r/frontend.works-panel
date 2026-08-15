import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";

export interface MaterialResponseType {
  id: number;
  name: string;
  basePrice: string;
  active: boolean;
  measureId: number | null;
  measure: MeasureResponseType | null;
  createdAt: string;
  updatedAt: string;
}
