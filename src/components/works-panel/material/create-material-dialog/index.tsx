"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import type { MeasureResponseType } from "@/@type/works-panel/measure/get-measure.type";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";
import { useCreateNewMaterial } from "@/hooks/works-panel/material/use-create-new-material";
import { CreateMaterialForm } from "../create-material-form";

interface CreateMaterialDialogProps {
  measures: MeasureResponseType[];
}

export function CreateMaterialDialog({ measures }: CreateMaterialDialogProps) {
  const { form, onInvalid, onSubmit } = useCreateNewMaterial();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormSheet
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Novo material
        </Button>
      }
      title="Novo material"
      description="Cadastre um novo material para suas obras."
      saveLabel="Cadastrar Material"
      formId="create-material-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateMaterialForm
        form={form}
        onInvalid={onInvalid}
        onSubmit={onSubmit}
        formId="create-material-form"
        measures={measures}
      />
    </FormSheet>
  );
}
