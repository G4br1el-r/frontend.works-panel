"use client";

import { useFormState } from "react-hook-form";
import type { EmployeerResponseType } from "@/@type/works-panel/employeer/get-employeer.type";
import { FormDialog } from "@/components/shared/form-dialog";
import { CreateEmployeerForm } from "@/components/works-panel/employeers/create-employeer-form";
import { useEditEmployeer } from "@/hooks/works-panel/employeer/use-edit-employeer";

interface EditEmployeerDialogProps {
  employeer: EmployeerResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeerDialog({ employeer, open, onOpenChange }: EditEmployeerDialogProps) {
  const { form, onInvalid, onSubmit } = useEditEmployeer({
    employeer,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar funcionário"
      description="Atualize os dados do colaborador."
      saveLabel="Salvar alterações"
      formId="edit-employeer-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateEmployeerForm form={form} onInvalid={onInvalid} onSubmit={onSubmit} formId="edit-employeer-form" />
    </FormDialog>
  );
}
