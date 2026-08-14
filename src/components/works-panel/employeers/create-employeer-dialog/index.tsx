"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import { FormDialog } from "@/components/shared/form-dialog";
import { Button } from "@/components/ui/button";
import { CreateEmployeerForm } from "@/components/works-panel/employeers/create-employeer-form";
import { useCreateNewEmployeer } from "@/hooks/works-panel/employeer/use-create-new-employeer";

export function CreateEmployeerDialog() {
  const { form, onInvalid, onSubmit } = useCreateNewEmployeer();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormDialog
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Novo funcionário
        </Button>
      }
      title="Novo funcionário"
      description="Cadastre um novo colaborador para suas obras."
      saveLabel="Cadastrar Funcionário"
      formId="create-employeer-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateEmployeerForm form={form} onInvalid={onInvalid} onSubmit={onSubmit} formId="create-employeer-form" />
    </FormDialog>
  );
}
