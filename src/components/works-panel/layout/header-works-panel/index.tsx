import { SidebarTrigger } from "@/components/ui/sidebar";

export function HeaderWorksPanel() {
  return (
    <header className="flex h-14 w-full items-center gap-3 border-b border-panel-border px-4">
      <SidebarTrigger className="text-panel-muted-foreground hover:bg-panel-muted hover:text-panel-surface-foreground cursor-pointer" />
      <p className="text-sm font-medium text-panel-muted-foreground">
        Gestão de obras
      </p>
    </header>
  );
}
