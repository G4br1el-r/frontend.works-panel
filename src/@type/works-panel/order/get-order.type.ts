import type {
  AddressResponseType,
  CustomerResponseType,
} from "@/@type/works-panel/customer/get-customer.type";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";

export type OrderStatus = "PENDING" | "ACCEPTED" | "CANCELED";
export type OrderOrigin = "SITE" | "PAINEL";

export interface OrderItemServiceItemResponseType {
  id: number;
  name: string;
  basePrice: string;
  active: boolean;
  measureId: number | null;
  segmentId: number | null;
  materials: MaterialResponseType[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemResponseType {
  id: number;
  orderId: number;
  serviceItemId: number;
  quantity: string;
  price: string;
  serviceItem: OrderItemServiceItemResponseType;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponseType {
  id: number;
  status: OrderStatus;
  origin: OrderOrigin;
  customerId: number;
  addressId: number;
  customer: CustomerResponseType;
  address: AddressResponseType;
  items: OrderItemResponseType[];
  createdAt: string;
  updatedAt: string;
}
