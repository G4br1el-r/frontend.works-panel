"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import type { MaterialResponseType } from "@/@type/works-panel/material/get-material.type";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import type { SegmentResponseType } from "@/@type/works-panel/segment/get-segment.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";
import { useCreateNewServiceItem } from "@/hooks/works-panel/service-item/use-create-new-service-item";
import { CreateServiceItemForm } from "../create-service-item-form";

interface CreateServiceItemDialogProps {
  measures: MeasureResponseType[];
  segments: SegmentResponseType[];
  materials: MaterialResponseType[];
}

export function CreateServiceItemDialog({
  measures,
  segments,
  materials,
}: CreateServiceItemDialogProps) {
  const { form, onInvalid, onSubmit } = useCreateNewServiceItem();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Novo serviço
        </Button>
      }
      title="Novo serviço"
      description="Cadastre um novo serviço para suas obras."
      saveLabel="Cadastrar Serviço"
      formId="create-service-item-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateServiceItemForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="create-service-item-form"
        measures={measures}
        segments={segments}
        materials={materials}
      />
    </FormSheet>
  );
}
