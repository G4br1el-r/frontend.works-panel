"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";
import { useCreateNewMeasure } from "@/hooks/works-panel/measure/use-create-new-measure";
import { CreateMeasureForm } from "../create-measure-form";

export function CreateMeasureDialog() {
  const { form, onInvalid, onSubmit } = useCreateNewMeasure();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Nova medida
        </Button>
      }
      title="Nova medida"
      description="Cadastre uma nova medida para seus serviços e materiais."
      saveLabel="Cadastrar Medida"
      formId="create-measure-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateMeasureForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="create-measure-form"
      />
    </FormSheet>
  );
}
