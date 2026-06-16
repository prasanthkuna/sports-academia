import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "destructive";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-active",
  secondary: "bg-canvas border border-hairline text-ink hover:bg-surface-soft",
  ghost: "text-muted hover:bg-surface-soft",
  whatsapp: "bg-[#25D366] text-white hover:opacity-90",
  destructive: "bg-error text-white hover:opacity-90",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(({ className, variant = "primary", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex h-11 min-h-[44px] items-center justify-center rounded-md px-5 text-sm font-semibold transition disabled:opacity-50 md:h-10",
      variants[variant],
      className,
    )}
    {...props}
  />
));
Button.displayName = "Button";
