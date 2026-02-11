"use client";

import UserPlaceholderImage from "@/assets/images/user-placeholder.png";
import { ImageIcon } from "lucide-react";
import Image, { type StaticImageData } from "next/image";

import { cn } from "@/lib/utils";

type ImageFit = "cover" | "contain" | "fill";

type Props = {
  src?: string | StaticImageData;
  alt?: string;
  className?: string;
  fit?: ImageFit;
  fallbackType?: "icon" | "image";
  priority?: boolean;
  onClick?: () => void;
};

const fitClassMap: Record<ImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
};

const FilledImage = ({
  src,
  alt = "Image",
  className,
  fit = "cover",
  fallbackType = "icon",
  priority = false,
  onClick,
}: Props) => {
  if (!src) {
    if (fallbackType === "image") {
      return (
        <div
          className={cn("relative size-full overflow-hidden", className)}
          onClick={onClick}
        >
          <Image
            src={UserPlaceholderImage}
            alt="Placeholder"
            fill
            priority={priority}
            unoptimized
            className="object-cover opacity-80"
          />
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        className={cn(
          "relative flex size-full items-center justify-center overflow-hidden bg-muted/10 text-muted-foreground",
          className,
        )}
        aria-label="No image"
      >
        <ImageIcon className={cn("size-full", "max-h-20 max-w-20")} />
      </div>
    );
  }

  return (
    <div
      className={cn("relative size-full overflow-hidden", className)}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100%"
        unoptimized
        className={cn(
          "bg-background transition-transform duration-200",
          fitClassMap[fit],
        )}
      />
    </div>
  );
};

export default FilledImage;
