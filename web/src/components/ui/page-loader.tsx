import Image from "next/image";
import { cn } from "@/lib/utils";
import { assets } from "@/lib/assets";

type PageLoaderProps = {
  className?: string;
  label?: string;
};

export function PageLoader({ className, label }: PageLoaderProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 py-24", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="brand-loader-ring absolute inset-0 rounded-full border-[3px] border-hairline border-t-brand border-r-brand/50" />
        <span className="brand-loader-orbit absolute inset-2 rounded-full border-2 border-dashed border-brand/30" />
        <span className="absolute inset-3 rounded-full bg-brand-soft/50" />
        <Image
          src={assets.brand.logoIcon}
          alt=""
          width={32}
          height={32}
          className="brand-loader-logo relative h-8 w-8"
          priority
        />
      </div>
      {label ? (
        <p className="text-sm font-medium text-muted">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );
}
