import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type IconName, iconMap } from "@/lib/utils/iconsMap";

interface InputWrapperProps {
  children: React.ReactNode;
  iconName?: IconName;
  isPassword?: boolean;
  showPassword?: boolean;
  isLoading?: boolean;
  classNameWrapper?: string;
  classNameIcon?: string;
  classNameErrorWrapper?: string;
  onShowPassword?: () => void;
  onSubmitIcon?: () => void;
}

export function InputWrapper({
  children,
  iconName,
  classNameWrapper,
  classNameIcon,
  classNameErrorWrapper,
  onSubmitIcon,
  isPassword,
  showPassword,
  onShowPassword,
  isLoading,
}: InputWrapperProps) {
  const Icon = iconName ? iconMap[iconName] : null;
  const IconPassword = iconMap[showPassword ? "eye" : "eyeClose"];

  return (
    <div
      className={cn(
        "w-full h-10 px-3 py-1 flex gap-3 items-center transition-all duration-300",
        classNameWrapper,
        classNameErrorWrapper,
      )}
    >
      {isLoading ? (
        <Loader2
          aria-hidden="true"
          className={cn("w-4 h-4 shrink-0 animate-spin", classNameIcon)}
        />
      ) : onSubmitIcon && Icon ? (
        <button
          type="button"
          onClick={onSubmitIcon}
          aria-label="Pesquisar"
          className="flex items-center justify-center shrink-0"
        >
          <Icon className={cn("w-4 h-4", classNameIcon)} />
        </button>
      ) : (
        Icon && (
          <Icon
            aria-hidden="true"
            className={cn("w-4 h-4 shrink-0", classNameIcon)}
          />
        )
      )}
      {children}
      {isPassword && IconPassword ? (
        <IconPassword
          onMouseDown={(e: { preventDefault: () => any }) => e.preventDefault()}
          onClick={() => onShowPassword?.()}
          aria-hidden="true"
          className={cn("w-4 h-4 shrink-0 cursor-pointer", classNameIcon)}
        />
      ) : null}
    </div>
  );
}
