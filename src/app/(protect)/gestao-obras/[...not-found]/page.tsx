import type { Metadata } from "next";
import { PanelNotFound } from "@/components/works-panel/layout/panel-not-found";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function GestaoObrasNotFoundPage() {
  return <PanelNotFound />;
}
