import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-hairline bg-canvas px-3 text-sm outline-none focus:ring-2 focus:ring-brand/30 md:h-10",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
