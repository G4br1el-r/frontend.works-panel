"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
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

async function createAddress(customerId: number, payload: unknown) {
  const response = await fetch(
    `/api/landingpage/customer/${customerId}/address`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    throw new Error("Falha ao cadastrar endereço");
  }

  return (await response.json()) as AddressResponseType;
}

interface UseAddAddressOptions {
  customerId: number;
  onAdded: (address: AddressResponseType) => void;
}

export function useAddAddress({ customerId, onAdded }: UseAddAddressOptions) {
  const router = useRouter();

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

  const lastLookedUpCepRef = useRef<string | null>(null);

  async function handleCepComplete(cep: string) {
    const digits = onlyDigits(cep);
    if (lastLookedUpCepRef.current === digits) return;
    lastLookedUpCepRef.current = digits;

    try {
      const address = await toast.promise(lookupCep(cep), {
        loading: "Buscando endereço...",
        success: "Endereço encontrado!",
        error: "CEP não encontrado.",
      });

      form.setValue("state", address.state, { shouldValidate: true });
      form.setValue("city", address.city, { shouldValidate: true });
      form.setValue("neighborhood", address.neighborhood, {
        shouldValidate: true,
      });
      form.setValue("street", address.street, { shouldValidate: true });
      form.setValue("latitude", address.latitude);
      form.setValue("longitude", address.longitude);
    } catch {
      lastLookedUpCepRef.current = null;
    }
  }

  async function onSubmit(data: AddressRegisterFormOutput) {
    const payload = { ...data, cep: onlyDigits(data.cep) };

    try {
      const address = await toast.promise(createAddress(customerId, payload), {
        loading: "Cadastrando endereço...",
        success: "Endereço cadastrado!",
        error: "Não foi possível cadastrar o endereço.",
      });
      form.reset();
      router.refresh();
      onAdded(address);
    } catch {}
  }

  function onInvalid(_errors: FieldErrors<AddressRegisterFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "add-address-error",
    });
  }

  return { form, onSubmit, onInvalid, handleCepComplete };
}

export type UseAddAddressReturn = ReturnType<typeof useAddAddress>;
