import { type IconName, iconMap } from "@/lib/utils/iconsMap";

interface WrapperFormProps {
  title: string;
  description?: string;
  icon?: IconName;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function WrapperForm({
  title,
  description,
  icon,
  children,
  action,
}: WrapperFormProps) {
  const Icon = icon ? iconMap[icon] : null;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl border border-panel-border bg-panel-surface">
      <header className="flex flex-col gap-3 border-b border-panel-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          {Icon && (
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-panel-page text-panel-surface-foreground">
              <Icon className="size-4.5" />
            </span>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="text-base font-semibold text-panel-surface-foreground">
              {title}
            </span>
            {description && (
              <span className="text-xs text-panel-muted-foreground sm:text-sm">
                {description}
              </span>
            )}
          </div>
        </div>
        {action && (
          <div className="flex shrink-0 flex-col sm:flex-row sm:items-center">
            {action}
          </div>
        )}
      </header>

      <div className="flex min-w-0 flex-col gap-4 p-4 sm:p-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
          {children}
        </div>
      </div>
    </section>
  );
}
