"use client";

import { useFormState } from "react-hook-form";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import type { ServiceItemResponseType } from "@/@type/works-panel/service-item/get-service-item.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { CreateServiceItemForm } from "@/components/works-panel/service-item/create-service-item-form";
import { useEditServiceItem } from "@/hooks/works-panel/service-item/use-edit-service-item";

interface EditServiceItemDialogProps {
  serviceItem: ServiceItemResponseType | null;
  measures: MeasureResponseType[];
  segments: SegmentResponseType[];
  materials: MaterialResponseType[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditServiceItemDialog({
  serviceItem,
  measures,
  segments,
  materials,
  open,
  onOpenChange,
}: EditServiceItemDialogProps) {
  const { form, onInvalid, onSubmit } = useEditServiceItem({
    serviceItem,
    onSuccess: () => onOpenChange(false),
  });
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Editar serviço"
      description="Atualize os dados do serviço."
      saveLabel="Salvar alterações"
      formId="edit-service-item-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateServiceItemForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="edit-service-item-form"
        measures={measures}
        segments={segments}
        materials={materials}
      />
    </FormSheet>
  );
}
