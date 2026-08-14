"use client";

import { Plus } from "lucide-react";
import { useFormState } from "react-hook-form";
import { FormDialog } from "@/components/shared/form-dialog";
import { Button } from "@/components/ui/button";
import { useCreateNewSegment } from "@/hooks/works-panel/segment/use-create-new-segment";
import { CreateSegmentForm } from "../create-segment-form";

export function CreateSegmentDialog() {
  const { form, onInvalid, onSubmit } = useCreateNewSegment();
  const { isSubmitting } = useFormState({ control: form.control });

  return (
    <FormDialog
      trigger={
        <Button className="h-10 w-full shrink-0 cursor-pointer gap-1.5 sm:w-auto">
          <Plus className="size-4" />
          Novo segmento
        </Button>
      }
      title="Novo segmento"
      description="Cadastre um novo segmento para suas obras."
      saveLabel="Cadastrar Segmento"
      formId="create-segment-form"
      onClear={() => form.reset()}
      disabled={isSubmitting}
    >
      <CreateSegmentForm form={form} onInvalid={onInvalid} onSubmit={onSubmit} formId="create-segment-form" />
    </FormDialog>
  );
}
