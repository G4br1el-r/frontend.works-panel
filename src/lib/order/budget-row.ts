import type {
  BudgetPaymentType,
  BudgetResponseType,
  BudgetStatus,
} from "@/@type/works-panel/order/get-budget.type";
import type {
  OrderResponseType,
  OrderStatus,
} from "@/@type/works-panel/order/get-order.type";

export type BudgetRowOrigin = "PAINEL" | "SITE";

/**
 * Linha da tabela de orçamentos. Junta o que vem do painel (Budget) e do site
 * (Order) num formato só — os campos que a origem não tem ficam nulos.
 */
export interface BudgetRow {
  key: string;
  id: number;
  origin: BudgetRowOrigin;
  href: string;
  customerName: string;
  addressLabel: string | null;
  status: BudgetStatus | OrderStatus;
  createdAt: string;
  /** Só o painel tem: período, valor fechado, parcelas e margem. */
  startDate: string | null;
  endDate: string | null;
  clientTotal: number | null;
  installmentsCount: number | null;
  profitMargin: number | null;
  paymentType: BudgetPaymentType | null;
  servicesCount: number;
  materialsCount: number | null;
  employeersCount: number | null;
}

function buildAddressLabel(
  address: { street?: string; number?: string } | null | undefined,
) {
  if (!address?.street) return null;
  return address.number
    ? `${address.street}, ${address.number}`
    : address.street;
}

export function budgetToRow(budget: BudgetResponseType): BudgetRow {
  const employeersCount = new Set(
    budget.allocations.map((allocation) => allocation.employeerId),
  ).size;

  return {
    key: `budget-${budget.id}`,
    id: budget.id,
    origin: "PAINEL",
    href: `/gestao-obras/orcamentos/${budget.id}`,
    customerName: budget.customer?.name ?? "—",
    addressLabel: buildAddressLabel(budget.address),
    status: budget.status,
    createdAt: budget.createdAt,
    startDate: budget.startDate,
    endDate: budget.endDate,
    clientTotal: Number(budget.clientTotal),
    installmentsCount: budget.installments.length,
    profitMargin: Number(budget.profitMargin),
    paymentType: budget.paymentType,
    servicesCount: budget.services.length,
    materialsCount: budget.materials.length,
    employeersCount,
  };
}

export function orderToRow(order: OrderResponseType): BudgetRow {
  return {
    key: `order-${order.id}`,
    id: order.id,
    origin: "SITE",
    href: `/gestao-obras/orcamentos/pedido/${order.id}`,
    customerName: order.customer?.name ?? "—",
    addressLabel: buildAddressLabel(order.address),
    status: order.status,
    createdAt: order.createdAt,
    // Pedido do site é manifestação de interesse: não tem obra planejada.
    startDate: null,
    endDate: null,
    clientTotal: null,
    installmentsCount: null,
    profitMargin: null,
    paymentType: null,
    servicesCount: order.items.length,
    materialsCount: null,
    employeersCount: null,
  };
}

/**
 * Junta orçamentos e pedidos numa lista só, ordenada do mais recente.
 *
 * Pedidos que já viraram orçamento saem da lista — o orçamento gerado ocupa o
 * lugar deles. Como não existe `GET /order/:id/budgets`, descobrimos isso pelo
 * `sourceOrderId` que cada orçamento carrega.
 */
export function mergeBudgetRows(
  budgets: BudgetResponseType[],
  orders: OrderResponseType[],
): BudgetRow[] {
  const budgetedOrderIds = new Set(
    budgets
      .map((budget) => budget.sourceOrderId)
      .filter((id): id is number => id !== null),
  );

  const pendingOrders = orders.filter(
    (order) => !budgetedOrderIds.has(order.id),
  );

  return [...budgets.map(budgetToRow), ...pendingOrders.map(orderToRow)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
