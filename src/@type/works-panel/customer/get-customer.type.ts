export type AddressType = "RESIDENTIAL" | "COMMERCIAL";

export interface AddressResponseType {
  id: number;
  type: AddressType;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  latitude: string;
  longitude: string;
  distanceInMeters: number;
  customerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponseType {
  id: number;
  name: string;
  cellPhone: string;
  document: string;
  email: string | null;
  observation: string | null;
  createdAt: string;
  updatedAt: string;
  addresses: AddressResponseType[];
}
