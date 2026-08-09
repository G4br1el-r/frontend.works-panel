import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Entrar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="min-h-dvh antialiased">
      <body className="flex min-h-dvh items-center justify-center bg-panel-page p-4 font-sans">
        {children}
      </body>
    </html>
  );
}
