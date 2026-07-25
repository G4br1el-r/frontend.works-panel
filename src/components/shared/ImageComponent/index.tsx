import Image from "next/image";
import { cn } from "@/utils/cn";

interface ImageComponentProps {
  src?: string | null;
  alt: string;
  priority?: boolean;
  sizes?: string;
  classNameImg?: string;
  classNameWrapper?: string;
}

export function ImageComponent({
  alt,
  src,
  classNameImg,
  classNameWrapper,
  priority,
  sizes,
}: ImageComponentProps) {
  return (
    <div className={cn("relative w-full h-full", classNameWrapper)}>
      {src && (
        <Image
          alt={alt}
          src={src}
          className={classNameImg}
          priority={priority}
          sizes={sizes}
          fill
        />
      )}
    </div>
  );
}
