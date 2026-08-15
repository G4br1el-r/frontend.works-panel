"use client";

import { useFormState } from "react-hook-form";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { CreateMeasureForm } from "@/components/works-panel/measure/create-measure-form";
import { useEditMeasure } from "@/hooks/works-panel/measure/use-edit-measure";

interface EditMeasureDialogProps {
  measure: MeasureResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMeasureDialog({
  measure,
  open,
  onOpenChange,
}: EditMeasureDialogProps) {
  const { form, onInvalid, onSubmit } = useEditMeasure({
    measure,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar medida"
      description="Atualize os dados da medida."
      saveLabel="Salvar alterações"
      formId="edit-measure-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateMeasureForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="edit-measure-form"
      />
    </FormSheet>
  );
}
