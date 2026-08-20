import { HardHat } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-panel-accent/10 text-panel-accent">
        <HardHat className="size-8" />
      </span>
      <span className="mt-6 text-6xl font-black text-panel-border sm:text-7xl">
        404
      </span>
      <h1 className="mt-2 text-lg font-semibold text-panel-surface-foreground sm:text-xl">
        Página não encontrada
      </h1>
      <p className="mt-2 max-w-sm text-sm text-panel-muted-foreground">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Button asChild className="mt-8 cursor-pointer">
        <Link href="/gestao-obras/orcamentos">Voltar para o painel</Link>
      </Button>
    </main>
  );
}
