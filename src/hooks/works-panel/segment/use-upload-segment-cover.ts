import { useState } from "react";

interface UploadSegmentCoverResponse {
  url: string;
}

export function useUploadSegmentCover() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function uploadCover(file: File) {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/works-panel/segment/upload-cover", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(data?.message ?? "Falha ao enviar imagem.");
      }

      const data = (await response.json()) as UploadSegmentCoverResponse;
      return data.url;
    } finally {
      setIsUploading(false);
    }
  }

  async function deleteCover(url: string) {
    setIsDeleting(true);

    try {
      await fetch("/api/works-panel/segment/upload-cover", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return { uploadCover, deleteCover, isUploading, isDeleting };
}
