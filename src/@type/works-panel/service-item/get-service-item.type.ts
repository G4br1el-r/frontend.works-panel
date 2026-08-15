import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";

export interface ServiceItemResponseType {
  id: number;
  name: string;
  basePrice: string;
  active: boolean;
  measureId: number | null;
  measure: MeasureResponseType | null;
  segmentId: number | null;
  segment: SegmentResponseType | null;
  materials: MaterialResponseType[];
  createdAt: string;
  updatedAt: string;
}
