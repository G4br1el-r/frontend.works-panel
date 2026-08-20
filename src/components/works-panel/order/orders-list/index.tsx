"use client";

import type { OrderResponseType } from "@/@type/works-panel/order/get-order.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { EmptyState } from "@/components/shared/empty-state";
import { OrderCard } from "@/components/works-panel/order/order-card";
import { OrdersFilterSheet } from "@/components/works-panel/order/orders-filter-sheet";
import { SearchOrders } from "@/components/works-panel/order/search-orders";
import { useOrders } from "@/hooks/works-panel/order/use-orders";

interface OrdersListProps {
  orders: OrderResponseType[];
  segments: SegmentResponseType[];
}

export function OrdersList({ orders, segments }: OrdersListProps) {
  const { search, setSearch, filters, filteredOrders } = useOrders({ orders });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <SearchOrders value={search} onChange={setSearch} />
        </div>
        <OrdersFilterSheet filters={filters} segments={segments} />
      </div>

      {filteredOrders.length > 0 ? (
        <Stagger staggerDelay={0.04} className="flex flex-col gap-3" onMount>
          {filteredOrders.map((order) => (
            <StaggerItem key={order.id} distance={10} duration={0.3}>
              <OrderCard order={order} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          icon="searchX"
          title="Nenhum orçamento encontrado"
          subtitle={
            search.trim()
              ? `Não encontramos resultados para "${search.trim()}".`
              : "Nenhum orçamento corresponde aos filtros selecionados."
          }
        />
      )}
    </div>
  );
}
