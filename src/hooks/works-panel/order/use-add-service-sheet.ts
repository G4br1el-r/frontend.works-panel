"use client";

import { useState } from "react";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import type { SelectComboboxOption } from "@/components/shared/select-combobox";
import { formatCurrency, generateId, maskCurrency } from "@/lib/utils";
import type { ServiceFormRow } from "@/store/works-panel/order/new-order-store";

interface DraftState {
  segmentId: string | null;
  segment: SegmentResponseType | null;
  serviceItemId: string | null;
  serviceItem: ServiceItemResponseType | null;
  quantity: string;
  unitPrice: string;
}

const EMPTY_DRAFT: DraftState = {
  segmentId: null,
  segment: null,
  serviceItemId: null,
  serviceItem: null,
  quantity: "1",
  unitPrice: "",
};

export function useAddServiceSheet(
  segments: SegmentResponseType[],
  existingRows: ServiceFormRow[],
) {
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [pendingItems, setPendingItems] = useState<ServiceFormRow[]>([]);

  const activeSegments = segments.filter((segment) => segment.active);

  const segmentOptions: SelectComboboxOption[] = activeSegments.map(
    (segment) => ({
      value: String(segment.id),
      label: segment.name,
    }),
  );

  const usedServiceItemIds = new Set([
    ...existingRows.map((row) => row.serviceItem.id),
    ...pendingItems.map((item) => item.serviceItem.id),
  ]);

  const serviceItemOptions: SelectComboboxOption[] = (
    draft.segment?.serviceItems ?? []
  )
    .filter((item) => item.active)
    .filter((item) => !usedServiceItemIds.has(item.id))
    .map((item) => ({
      value: String(item.id),
      label: item.name,
      hint: formatCurrency(Number(item.basePrice)),
    }));

  function reset() {
    setDraft(EMPTY_DRAFT);
    setPendingItems([]);
  }

  function handleSegmentChange(segmentId: string | null) {
    const segment = segmentId
      ? (activeSegments.find((entry) => String(entry.id) === segmentId) ?? null)
      : null;
    setDraft({ ...EMPTY_DRAFT, segmentId, segment });
  }

  function handleServiceItemChange(serviceItemId: string | null) {
    const serviceItem =
      draft.segment?.serviceItems?.find(
        (item) => String(item.id) === serviceItemId,
      ) ?? null;
    setDraft((current) => ({
      ...current,
      serviceItemId,
      serviceItem: serviceItem
        ? { ...serviceItem, segment: draft.segment }
        : null,
      unitPrice: serviceItem ? maskCurrency(Number(serviceItem.basePrice)) : "",
    }));
  }

  function handleQuantityChange(quantity: string) {
    setDraft((current) => ({ ...current, quantity }));
  }

  function handleUnitPriceChange(unitPrice: string) {
    setDraft((current) => ({ ...current, unitPrice }));
  }

  const canAddDraft =
    Boolean(draft.serviceItem) &&
    Number(draft.quantity || 0) > 0 &&
    Boolean(draft.unitPrice);

  function handleAddDraftToPending() {
    if (!draft.serviceItem || !canAddDraft) return;

    setPendingItems((current) => [
      ...current,
      {
        id: generateId(),
        serviceItem: draft.serviceItem!,
        quantity: draft.quantity,
        unitPrice: draft.unitPrice,
      },
    ]);
    setDraft({
      ...EMPTY_DRAFT,
      segmentId: draft.segmentId,
      segment: draft.segment,
    });
  }

  function handleRemovePendingItem(id: string) {
    setPendingItems((current) => current.filter((item) => item.id !== id));
  }

  return {
    draft,
    pendingItems,
    segmentOptions,
    serviceItemOptions,
    canAddDraft,
    reset,
    handleSegmentChange,
    handleServiceItemChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleAddDraftToPending,
    handleRemovePendingItem,
  };
}
