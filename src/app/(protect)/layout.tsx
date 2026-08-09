import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/shared/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/works-panel/layout/app-sidebar";
import { HeaderWorksPanel } from "@/components/works-panel/layout/header-works-panel";

export const metadata: Metadata = {
  title: "Painel",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProtectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="min-h-dvh antialiased">
      <body className="flex min-h-dvh bg-panel-page font-sans">
        <SidebarProvider>
          <AppSidebar />
          <div className="flex w-full min-w-0 flex-col overflow-hidden bg-panel-surface text-panel-surface-foreground md:m-2 md:ml-0 md:rounded-lg md:border md:border-panel-border md:shadow-sm">
            <HeaderWorksPanel />
            <main className="flex-1 overflow-y-auto bg-panel-page/40 p-4 sm:p-6">
              {children}
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
