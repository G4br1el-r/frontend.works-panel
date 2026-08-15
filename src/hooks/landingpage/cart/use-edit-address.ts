"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { CepResponseType } from "@/@type/works-panel/cep/get-cep.type";
import type { AddressResponseType } from "@/@type/works-panel/customer/get-customer.type";
import {
  type AddressRegisterFormData,
  type AddressRegisterFormOutput,
  addressRegisterSchema,
} from "@/schema/landingpage/cart/address-register-schema";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

async function lookupCep(cep: string) {
  const response = await fetch(`/api/landingpage/cep/${onlyDigits(cep)}`);

  if (!response.ok) {
    throw new Error("CEP não encontrado");
  }

  return (await response.json()) as CepResponseType;
}

async function updateAddress(
  customerId: number,
  addressId: number,
  payload: unknown,
) {
  const response = await fetch(
    `/api/landingpage/customer/${customerId}/address/${addressId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Falha ao atualizar endereço");
  }

  return (await response.json()) as AddressResponseType;
}

interface UseEditAddressOptions {
  customerId: number;
  address: AddressResponseType | null;
  onUpdated: (address: AddressResponseType) => void;
}

export function useEditAddress({
  customerId,
  address,
  onUpdated,
}: UseEditAddressOptions) {
  const form = useForm<
    AddressRegisterFormData,
    unknown,
    AddressRegisterFormOutput
  >({
    resolver: zodResolver(addressRegisterSchema),
    defaultValues: {
      type: "RESIDENTIAL",
      cep: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      latitude: 0,
      longitude: 0,
    },
  });

  useEffect(() => {
    if (!address) return;

    form.reset({
      type: address.type,
      cep: address.cep,
      state: address.state,
      city: address.city,
      neighborhood: address.neighborhood,
      street: address.street,
      number: address.number,
      latitude: Number(address.latitude),
      longitude: Number(address.longitude),
    });
  }, [address, form]);

  async function handleCepComplete(cep: string) {
    try {
      const result = await toast.promise(lookupCep(cep), {
        loading: "Buscando endereço...",
        success: "Endereço encontrado!",
        error: "CEP não encontrado.",
      });

      form.setValue("state", result.state, { shouldValidate: true });
      form.setValue("city", result.city, { shouldValidate: true });
      form.setValue("neighborhood", result.neighborhood, {
        shouldValidate: true,
      });
      form.setValue("street", result.street, { shouldValidate: true });
      form.setValue("latitude", result.latitude);
      form.setValue("longitude", result.longitude);
    } catch {}
  }

  async function onSubmit(data: AddressRegisterFormOutput) {
    if (!address) return;

    const payload = { ...data, cep: onlyDigits(data.cep) };

    try {
      const updated = await toast.promise(
        updateAddress(customerId, address.id, payload),
        {
          loading: "Salvando alterações...",
          success: "Endereço atualizado!",
          error: "Não foi possível atualizar o endereço.",
        },
      );
      onUpdated(updated);
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<AddressRegisterFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "edit-address-error",
    });
  }

  return { form, onSubmit, onInvalid, handleCepComplete };
}

export type UseEditAddressReturn = ReturnType<typeof useEditAddress>;
