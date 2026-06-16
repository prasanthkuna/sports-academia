"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AssetImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fallback: React.ReactNode;
};

export function AssetImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  loading,
  fallback,
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : loading ?? "lazy"}
      className={cn(className)}
      onError={() => setFailed(true)}
    />
  );
}
