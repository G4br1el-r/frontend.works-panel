import { HardHat, type LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

interface EmptyEmployeersProps {
  icon?: LucideIcon;
  title?: string;
  subtitle?: string;
}

export function EmptyEmployeers({
  icon: Icon = HardHat,
  title = "Nenhum funcionário cadastrado",
  subtitle = "Cadastre a equipe para acompanhar quem está em cada obra.",
}: EmptyEmployeersProps) {
  return (
    <FadeIn
      direction="up"
      distance={16}
      delay={0.1}
      onMount
      className="flex flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-panel-border bg-panel-surface px-6 py-16 text-center"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-panel-accent-light text-panel-accent">
        <Icon className="size-6" />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-panel-surface-foreground">
          {title}
        </p>
        <p className="text-sm text-panel-muted-foreground">{subtitle}</p>
      </div>
    </FadeIn>
  );
}
