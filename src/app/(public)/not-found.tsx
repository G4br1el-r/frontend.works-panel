import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70dvh] flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <span className="font-black text-7xl text-transparent leading-none [-webkit-text-stroke:1.5px_theme(colors.white/40%)] sm:text-8xl">
        404
      </span>
      <h1 className="mt-4 font-display text-xl text-white sm:text-2xl">
        Página não encontrada
      </h1>
      <p className="mt-2 max-w-sm text-sm text-white/60 sm:text-base">
        O endereço que você tentou acessar não existe ou foi movido.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 bg-linear-to-r from-brand-light via-brand to-brand-deep px-6 py-3 text-xs font-bold tracking-widest text-black transition-all duration-300 ease-out hover:scale-102 hover:shadow-(--shadow-brand-hover) active:scale-98"
      >
        VOLTAR PARA O INÍCIO
      </Link>
    </main>
  );
}
