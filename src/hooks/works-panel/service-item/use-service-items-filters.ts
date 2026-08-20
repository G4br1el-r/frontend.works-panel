"use client";

import { useMemo, useState } from "react";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";

export type ServiceItemStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export interface ServiceItemsFiltersState {
  segmentIds: string[];
  measureIds: string[];
  status: ServiceItemStatusFilter;
  minPrice: string;
  maxPrice: string;
}

const DEFAULT_FILTERS: ServiceItemsFiltersState = {
  segmentIds: [],
  measureIds: [],
  status: "ALL",
  minPrice: "",
  maxPrice: "",
};

function parseCurrency(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return null;
  return Number(digits) / 100;
}

export function useServiceItemsFilters() {
  const [filters, setFilters] =
    useState<ServiceItemsFiltersState>(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] =
    useState<ServiceItemsFiltersState>(DEFAULT_FILTERS);
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.segmentIds.length > 0) count += 1;
    if (filters.measureIds.length > 0) count += 1;
    if (filters.status !== "ALL") count += 1;
    if (filters.minPrice) count += 1;
    if (filters.maxPrice) count += 1;
    return count;
  }, [filters]);

  function applyServiceItemFilters(serviceItems: ServiceItemResponseType[]) {
    const minPrice = parseCurrency(filters.minPrice);
    const maxPrice = parseCurrency(filters.maxPrice);

    return serviceItems.filter((serviceItem) => {
      if (
        filters.segmentIds.length > 0 &&
        (!serviceItem.segmentId ||
          !filters.segmentIds.includes(String(serviceItem.segmentId)))
      ) {
        return false;
      }

      if (
        filters.measureIds.length > 0 &&
        (!serviceItem.measureId ||
          !filters.measureIds.includes(String(serviceItem.measureId)))
      ) {
        return false;
      }

      if (filters.status === "ACTIVE" && !serviceItem.active) return false;
      if (filters.status === "INACTIVE" && serviceItem.active) return false;

      const price = Number(serviceItem.basePrice);
      if (minPrice !== null && price < minPrice) return false;
      if (maxPrice !== null && price > maxPrice) return false;

      return true;
    });
  }

  function openSheet() {
    setDraftFilters(filters);
    setIsOpen(true);
  }

  function handleOpenChange(open: boolean) {
    if (open) {
      setDraftFilters(filters);
    }
    setIsOpen(open);
  }

  function applyDraftFilters() {
    setFilters(draftFilters);
    setIsOpen(false);
  }

  function clearDraftFilters() {
    setDraftFilters(DEFAULT_FILTERS);
  }

  function clearFilters() {
    setFilters(DEFAULT_FILTERS);
    setDraftFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    draftFilters,
    setDraftFilters,
    activeFiltersCount,
    applyServiceItemFilters,
    isOpen,
    openSheet,
    onOpenChange: handleOpenChange,
    applyDraftFilters,
    clearDraftFilters,
    clearFilters,
  };
}

export type UseServiceItemsFiltersReturn = ReturnType<
  typeof useServiceItemsFilters
>;
