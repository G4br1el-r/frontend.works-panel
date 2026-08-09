import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: [
        "accent",
        "accent-foreground",
        "background",
        "border",
        "brand",
        "brand-deep",
        "brand-light",
        "destructive",
        "destructive-foreground",
        "foreground",
        "gray-dark",
        "input",
        "muted",
        "muted-foreground",
        "panel-accent",
        "panel-accent-foreground",
        "panel-accent-light",
        "panel-border",
        "panel-muted",
        "panel-muted-foreground",
        "panel-page",
        "panel-surface",
        "panel-surface-foreground",
        "primary",
        "primary-foreground",
        "ring",
        "secondary",
        "secondary-foreground",
        "sidebar",
        "sidebar-accent",
        "sidebar-accent-foreground",
        "sidebar-border",
        "sidebar-foreground",
        "sidebar-primary",
        "sidebar-primary-foreground",
        "sidebar-ring",
        "status-danger",
        "status-danger-bg",
        "status-info",
        "status-info-bg",
        "status-success",
        "status-success-bg",
        "status-warning",
        "status-warning-bg",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
