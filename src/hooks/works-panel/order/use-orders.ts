"use client";

import { useState } from "react";
import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import { useOrdersFilters } from "@/hooks/works-panel/order/use-orders-filters";

interface UseOrdersOptions {
  orders: OrderResponseType[];
}

export function useOrders({ orders }: UseOrdersOptions) {
  const [search, setSearch] = useState("");
  const filters = useOrdersFilters();

  const normalizedSearch = search.trim().toLowerCase();

  const bySearch = normalizedSearch
    ? orders.filter((order) =>
        order.customer.name.toLowerCase().includes(normalizedSearch),
      )
    : orders;

  const filteredOrders = filters.applyOrderFilters(bySearch);

  return {
    search,
    setSearch,
    filters,
    filteredOrders,
  };
}

export type UseOrdersReturn = ReturnType<typeof useOrders>;
