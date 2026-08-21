"use client";

import { RotateCcw } from "lucide-react";
import { TitleSection } from "@/components/shared/title-section";
import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex w-full min-w-0 flex-col gap-6">
      <TitleSection
        title="Dashboard"
        subtitle="Visão consolidada do período: o que foi orçado, o que fechou e o que está agendado."
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-panel-border border-dashed bg-panel-surface px-6 py-16 text-center">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-panel-surface-foreground text-sm">
            Não foi possível carregar o dashboard
          </p>
          <p className="max-w-md text-panel-muted-foreground text-sm">
            {error.message || "Verifique sua conexão e tente novamente."}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer gap-1.5 border border-panel-border bg-panel-surface text-panel-muted-foreground transition-colors hover:bg-panel-page hover:text-panel-surface-foreground!"
          onClick={reset}
        >
          <RotateCcw className="size-4" />
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
