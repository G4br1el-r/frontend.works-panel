"use client";

import { ImageUp, Loader2, X } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { toast } from "react-hot-toast";
import { ImageComponent } from "@/components/shared/image-component";
import { useUploadSegmentCover } from "@/hooks/works-panel/segment/use-upload-segment-cover";
import { cn } from "@/lib/utils/cn";

interface SegmentCoverUploadFieldProps {
  id?: string;
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

export function SegmentCoverUploadField({
  id,
  value,
  onChange,
  disabled,
  hasError,
}: SegmentCoverUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadCover, deleteCover, isUploading, isDeleting } =
    useUploadSegmentCover();
  const isBusy = disabled || isUploading || isDeleting;

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const previousValue = value;

    try {
      const url = await uploadCover(file);
      onChange(url);
      if (previousValue) void deleteCover(previousValue);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a imagem.",
      );
    }
  }

  function handleRemove() {
    if (value) void deleteCover(value);
    onChange("");
  }

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-panel-border bg-panel-page/60 transition-all",
        hasError && "animate-shake border-destructive",
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        disabled={isBusy}
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isBusy}
        className={cn(
          "flex h-full w-full items-center justify-center",
          !isBusy && "cursor-pointer hover:border-panel-accent",
          isBusy && "cursor-not-allowed opacity-70",
        )}
      >
        {value ? (
          <ImageComponent
            src={value}
            alt="Capa do segmento"
            classNameImg="object-cover object-center"
            sizes="(min-width: 640px) 480px, 100vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-panel-muted-foreground">
            <ImageUp className="size-5" />
            <span className="text-xs">Clique para enviar uma imagem</span>
          </div>
        )}
      </button>

      {(isUploading || isDeleting) && (
        <div className="absolute inset-0 flex items-center justify-center bg-panel-page/80">
          <Loader2 className="size-5 animate-spin text-panel-accent" />
        </div>
      )}

      {value && !isUploading && !isDeleting && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleRemove();
          }}
          disabled={isBusy}
          className="absolute top-2 right-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
        >
          <X className="size-3.5" />
          <span className="sr-only">Remover imagem</span>
        </button>
      )}
    </div>
  );
}
