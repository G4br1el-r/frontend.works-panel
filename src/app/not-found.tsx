import Link from "next/link";
import "./globals.css";
import { SITE_NAME } from "@/lib/utils/constants";

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className="min-h-full antialiased">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-black px-4 font-sans text-white">
        <div className="flex w-full max-w-md flex-col items-center text-center">
          <span className="font-black text-7xl text-transparent leading-none [-webkit-text-stroke:1.5px_theme(colors.white/40%)] sm:text-8xl">
            404
          </span>
          <h1 className="mt-4 text-xl font-bold sm:text-2xl">
            Página não encontrada
          </h1>
          <p className="mt-2 text-sm text-white/60 sm:text-base">
            O endereço que você tentou acessar não existe ou foi movido.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-6 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98"
          >
            VOLTAR PARA O INÍCIO
          </Link>
          <span className="mt-10 text-xs text-white/30">{SITE_NAME}</span>
        </div>
      </body>
    </html>
  );
}
