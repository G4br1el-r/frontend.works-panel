"use client";

import { useState } from "react";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { SelectComboboxOption } from "@/components/shared/select-combobox";
import { formatCurrency, generateId, maskCurrency } from "@/lib/utils";
import type { MaterialFormRow } from "@/store/works-panel/order/new-order-store";

type MaterialDraftRow = Omit<MaterialFormRow, "sourceServiceRowIds">;

interface DraftState {
  materialId: string | null;
  material: MaterialResponseType | null;
  quantity: string;
  unitPrice: string;
}

const EMPTY_DRAFT: DraftState = {
  materialId: null,
  material: null,
  quantity: "1",
  unitPrice: "",
};

export function useAddMaterialSheet(
  materials: MaterialResponseType[],
  existingRows: MaterialFormRow[],
) {
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [pendingItems, setPendingItems] = useState<MaterialDraftRow[]>([]);

  const usedMaterialIds = new Set([
    ...existingRows.map((row) => row.material.id),
    ...pendingItems.map((item) => item.material.id),
  ]);

  const materialOptions: SelectComboboxOption[] = materials
    .filter((material) => material.active)
    .filter((material) => !usedMaterialIds.has(material.id))
    .map((material) => ({
      value: String(material.id),
      label: material.name,
      hint: formatCurrency(Number(material.basePrice)),
    }));

  function reset() {
    setDraft(EMPTY_DRAFT);
    setPendingItems([]);
  }

  function handleMaterialChange(materialId: string | null) {
    const material =
      materials.find((entry) => String(entry.id) === materialId) ?? null;
    setDraft((current) => ({
      ...current,
      materialId,
      material,
      unitPrice: material ? maskCurrency(Number(material.basePrice)) : "",
    }));
  }

  function handleQuantityChange(quantity: string) {
    setDraft((current) => ({ ...current, quantity }));
  }

  function handleUnitPriceChange(unitPrice: string) {
    setDraft((current) => ({ ...current, unitPrice }));
  }

  const canAddDraft =
    Boolean(draft.material) &&
    Number(draft.quantity || 0) > 0 &&
    Boolean(draft.unitPrice);

  function handleAddDraftToPending() {
    if (!draft.material || !canAddDraft) return;

    setPendingItems((current) => [
      ...current,
      {
        id: generateId(),
        material: draft.material!,
        quantity: draft.quantity,
        unitPrice: draft.unitPrice,
      },
    ]);
    setDraft(EMPTY_DRAFT);
  }

  function handleRemovePendingItem(id: string) {
    setPendingItems((current) => current.filter((item) => item.id !== id));
  }

  return {
    draft,
    pendingItems,
    materialOptions,
    canAddDraft,
    reset,
    handleMaterialChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleAddDraftToPending,
    handleRemovePendingItem,
  };
}
