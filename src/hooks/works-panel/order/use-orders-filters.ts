"use client";

import { useMemo, useState } from "react";
import type {
  OrderResponseType,
  OrderStatus,
} from "@/@type/works-panel/order/get-order.type";

export interface OrdersFiltersState {
  statuses: OrderStatus[];
  segmentIds: string[];
}

const DEFAULT_FILTERS: OrdersFiltersState = {
  statuses: [],
  segmentIds: [],
};

export function useOrdersFilters() {
  const [filters, setFilters] = useState<OrdersFiltersState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] =
    useState<OrdersFiltersState>(DEFAULT_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.statuses.length > 0) count += 1;
    if (filters.segmentIds.length > 0) count += 1;
    return count;
  }, [filters]);

  function applyOrderFilters(orders: OrderResponseType[]) {
    return orders.filter((order) => {
      if (
        filters.statuses.length > 0 &&
        !filters.statuses.includes(order.status)
      ) {
        return false;
      }

      if (filters.segmentIds.length > 0) {
        const orderSegmentIds = order.items.map((item) =>
          String(item.serviceItem.segmentId),
        );
        const hasMatchingSegment = orderSegmentIds.some((segmentId) =>
          filters.segmentIds.includes(segmentId),
        );
        if (!hasMatchingSegment) return false;
      }

      return true;
    });
  }

  function handleOpenChange(open: boolean) {
    if (open) setDraftFilters(filters);
    setIsOpen(open);
  }

  function applyDraftFilters() {
    setFilters(draftFilters);
    setIsOpen(false);
  }

  function clearDraftFilters() {
    setDraftFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    draftFilters,
    setDraftFilters,
    activeFiltersCount,
    applyOrderFilters,
    isOpen,
    onOpenChange: handleOpenChange,
    applyDraftFilters,
    clearDraftFilters,
  };
}

export type UseOrdersFiltersReturn = ReturnType<typeof useOrdersFilters>;
