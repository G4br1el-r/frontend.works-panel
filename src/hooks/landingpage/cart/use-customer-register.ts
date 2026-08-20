"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { CepResponseType } from "@/@type/works-panel/cep/get-cep.type";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import {
  type CustomerRegisterFormData,
  type CustomerRegisterFormOutput,
  customerRegisterSchema,
} from "@/schema/landingpage/cart/customer-register-schema";

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

class CustomerRegisterError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function createCustomer(payload: unknown) {
  const response = await fetch("/api/landingpage/customer/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message[0]
      : body?.message;

    throw new CustomerRegisterError(
      message ?? "Falha ao concluir seu cadastro",
      body?.code,
    );
  }

  return (await response.json()) as CustomerResponseType;
}

interface UseCustomerRegisterOptions {
  document: string;
  onRegistered: (customer: CustomerResponseType) => void;
}

export function useCustomerRegister({
  document,
  onRegistered,
}: UseCustomerRegisterOptions) {
  const form = useForm<
    CustomerRegisterFormData,
    unknown,
    CustomerRegisterFormOutput
  >({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      name: "",
      cellPhone: "",
      email: "",
      addressType: "RESIDENTIAL",
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

  async function handleCepComplete(cep: string) {
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
    } catch {}
  }

  async function onSubmit(data: CustomerRegisterFormOutput) {
    const payload = {
      name: data.name,
      cellPhone: onlyDigits(data.cellPhone),
      document: onlyDigits(document),
      email: data.email,
      addresses: [
        {
          type: data.addressType,
          cep: onlyDigits(data.cep),
          state: data.state,
          city: data.city,
          neighborhood: data.neighborhood,
          street: data.street,
          number: data.number,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      ],
    };

    try {
      const customer = await toast.promise(createCustomer(payload), {
        loading: "Finalizando seu cadastro...",
        success: "Cadastro concluído!",
        error: (error) =>
          error instanceof CustomerRegisterError
            ? error.message
            : "Não foi possível concluir seu cadastro.",
      });
      onRegistered(customer);
    } catch (error) {
      if (error instanceof CustomerRegisterError && error.code === "CONFLICT") {
        form.setError("cellPhone", {
          type: "manual",
          message: "Já existe um cadastro com esses dados.",
        });
      }
    }
  }

  function onInvalid(_errors: FieldErrors<CustomerRegisterFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "customer-register-error",
    });
  }

  return { form, onSubmit, onInvalid, handleCepComplete };
}

export type UseCustomerRegisterReturn = ReturnType<typeof useCustomerRegister>;
