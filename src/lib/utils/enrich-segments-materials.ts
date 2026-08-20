import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";

export function enrichSegmentsMaterials(
  segments: SegmentResponseType[],
  materials: MaterialResponseType[],
): SegmentResponseType[] {
  const materialsById = new Map(
    materials.map((material) => [material.id, material]),
  );

  return segments.map((segment) => ({
    ...segment,
    serviceItems: segment.serviceItems?.map((serviceItem) => ({
      ...serviceItem,
      materials: serviceItem.materials.map(
        (material) => materialsById.get(material.id) ?? material,
      ),
    })),
  }));
}
