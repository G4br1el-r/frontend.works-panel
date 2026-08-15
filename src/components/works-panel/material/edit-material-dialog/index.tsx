"use client";

import { useFormState } from "react-hook-form";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { CreateMaterialForm } from "@/components/works-panel/material/create-material-form";
import { useEditMaterial } from "@/hooks/works-panel/material/use-edit-material";

interface EditMaterialDialogProps {
  material: MaterialResponseType | null;
  measures: MeasureResponseType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMaterialDialog({
  material,
  measures,
  open,
  onOpenChange,
}: EditMaterialDialogProps) {
  const { form, onInvalid, onSubmit } = useEditMaterial({
    material,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar material"
      description="Atualize os dados do material."
      saveLabel="Salvar alterações"
      formId="edit-material-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateMaterialForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="edit-material-form"
        measures={measures}
      />
    </FormSheet>
  );
}
