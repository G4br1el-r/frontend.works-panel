interface TitleSectionProps {
  title: string;
  subtitle: string;
}

export function TitleSection({ title, subtitle }: TitleSectionProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1 shrink-0 rounded-full bg-panel-accent" />
        <h2 className="font-display text-xl text-panel-surface-foreground sm:text-2xl">{title}</h2>
      </div>
      <p className="pl-3.5 text-sm text-panel-muted-foreground">{subtitle}</p>
    </div>
  );
}
