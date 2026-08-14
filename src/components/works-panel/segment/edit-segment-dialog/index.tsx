"use client";

import { useFormState } from "react-hook-form";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { FormDialog } from "@/components/shared/form-dialog";
import { CreateSegmentForm } from "@/components/works-panel/segment/create-segment-form";
import { useEditSegment } from "@/hooks/works-panel/segment/use-edit-segment";

interface EditSegmentDialogProps {
  segment: SegmentResponseType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSegmentDialog({
  segment,
  open,
  onOpenChange,
}: EditSegmentDialogProps) {
  const { form, onInvalid, onSubmit } = useEditSegment({
    segment,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar segmento"
      description="Atualize os dados do segmento."
      saveLabel="Salvar alterações"
      formId="edit-segment-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateSegmentForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="edit-segment-form"
      />
    </FormDialog>
  );
}
