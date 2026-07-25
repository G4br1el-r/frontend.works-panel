import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Guilherme Goulart | Prestação de Serviços",
  description:
    "Prestação de serviços com Guilherme Goulart. Solicite seu orçamento.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`min-h-full scroll-smooth antialiased ${archivo.variable} ${archivoBlack.variable}`}
    >
      <body className="min-h-full flex flex-col bg-black font-sans">
        {children}
      </body>
    </html>
  );
}
