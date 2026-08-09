import type { ComponentProps } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils/cn";

interface TooltipComponentProps extends ComponentProps<typeof Tooltip> {
  content: React.ReactNode;
  children: React.ReactNode;
  contentProps?: ComponentProps<typeof TooltipContent>;
  disabled?: boolean;
}

export function TooltipComponent({
  content,
  children,
  contentProps,
  disabled,
  disableHoverableContent = true,
  ...props
}: TooltipComponentProps) {
  if (disabled) {
    return children;
  }

  return (
    <Tooltip disableHoverableContent={disableHoverableContent} {...props}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        {...contentProps}
        className={cn(
          "bg-white text-black **:data-[slot=tooltip-arrow]:bg-white **:data-[slot=tooltip-arrow]:fill-white",
          contentProps?.className,
        )}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
