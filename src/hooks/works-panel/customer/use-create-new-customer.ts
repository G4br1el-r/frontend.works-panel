"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { type FieldErrors, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import type { CepResponseType } from "@/@type/works-panel/cep/get-cep.type";
import type { CustomerResponseType } from "@/@type/works-panel/customer/get-customer.type";
import {
  type CreateCustomerFormData,
  type CreateCustomerFormOutput,
  createCustomerSchema,
} from "@/schema/works-panel/customer/create-customer";

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

class CreateCustomerError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message);
  }
}

async function createCustomer(payload: unknown) {
  const response = await fetch("/api/works-panel/customer/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new CreateCustomerError(
      body?.message ?? "Falha ao cadastrar cliente",
      body?.code,
    );
  }

  return (await response.json()) as CustomerResponseType;
}

interface UseCreateNewCustomerOptions {
  onCreated?: (customer: CustomerResponseType) => void;
}

export function useCreateNewCustomer({
  onCreated,
}: UseCreateNewCustomerOptions = {}) {
  const router = useRouter();

  const form = useForm<
    CreateCustomerFormData,
    unknown,
    CreateCustomerFormOutput
  >({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      name: "",
      cellPhone: "",
      document: "",
      email: "",
      observation: "",
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

  async function onSubmit(data: CreateCustomerFormOutput) {
    const payload = {
      name: data.name,
      cellPhone: onlyDigits(data.cellPhone),
      document: onlyDigits(data.document),
      email: data.email,
      observation: data.observation,
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
        loading: "Cadastrando cliente...",
        success: "Cliente cadastrado com sucesso.",
        error: (error) => {
          if (!(error instanceof CreateCustomerError)) {
            return "Não foi possível cadastrar o cliente.";
          }
          if (error.code === "CONFLICT") {
            return "Já existe um cliente com esse CPF/CNPJ.";
          }
          return error.message;
        },
      });
      form.reset();
      router.refresh();
      onCreated?.(customer);
    } catch (error) {
      if (error instanceof CreateCustomerError && error.code === "CONFLICT") {
        form.setError("document", {
          type: "manual",
          message: "Já existe um cliente com esse CPF/CNPJ.",
        });
      }
    }
  }

  function onInvalid(_errors: FieldErrors<CreateCustomerFormData>) {
    toast.error("Confira os campos destacados.", {
      id: "create-customer-error",
    });
  }

  return { form, onSubmit, onInvalid, handleCepComplete };
}

export type UseCreateNewCustomerReturn = ReturnType<
  typeof useCreateNewCustomer
>;
