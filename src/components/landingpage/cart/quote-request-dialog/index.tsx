"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type QuoteRequestFormData,
  quoteRequestSchema,
} from "@/schema/landingpage/cart/quote-request-schema";
import { useContactStore } from "@/store/landingpage/solutions/contact-store";

const FIELD_LABEL_CLASSNAME =
  "text-xs font-semibold tracking-widest text-brand";

const FIELD_INPUT_CLASSNAME =
  "border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-brand";

interface QuoteRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

export function QuoteRequestDialog({
  open,
  onOpenChange,
  onSubmitted,
}: QuoteRequestDialogProps) {
  const setContact = useContactStore((state) => state.setContact);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<QuoteRequestFormData>({
    resolver: zodResolver(quoteRequestSchema),
    defaultValues: { name: "", cep: "", phone: "" },
  });

  const onSubmit = (data: QuoteRequestFormData) => {
    setContact(data);
    reset();
    onSubmitted();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Finalizar solicitação</DialogTitle>
          <DialogDescription>
            Preencha seus dados para que a gente possa te enviar o orçamento
            certo para a sua obra.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-name" className={FIELD_LABEL_CLASSNAME}>
              NOME OU EMPRESA
            </label>
            <input
              id="quote-name"
              type="text"
              placeholder="Seu nome ou o nome da empresa"
              className={FIELD_INPUT_CLASSNAME}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-cep" className={FIELD_LABEL_CLASSNAME}>
              CEP DA OBRA
            </label>
            <Controller
              control={control}
              name="cep"
              render={({ field }) => (
                <IMaskInput
                  id="quote-cep"
                  mask="00000-000"
                  inputMode="numeric"
                  placeholder="00000-000"
                  className={FIELD_INPUT_CLASSNAME}
                  value={field.value}
                  onAccept={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.cep && (
              <p className="text-xs text-red-400">{errors.cep.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="quote-phone" className={FIELD_LABEL_CLASSNAME}>
              CELULAR / WHATSAPP
            </label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <IMaskInput
                  id="quote-phone"
                  mask="(00) 00000-0000"
                  inputMode="numeric"
                  placeholder="(00) 00000-0000"
                  className={FIELD_INPUT_CLASSNAME}
                  value={field.value}
                  onAccept={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.phone && (
              <p className="text-xs text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <DialogFooter>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex cursor-pointer items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-4 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98 disabled:pointer-events-none disabled:opacity-60"
            >
              <Send size={14} aria-hidden="true" />
              SOLICITAR ORÇAMENTO
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
