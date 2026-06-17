import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
};

export function AuthShell({ children, aside, className }: AuthShellProps) {
  return (
    <div className={cn("relative min-h-screen bg-canvas", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(15,118,110,0.14),transparent)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_100%_0%,rgba(15,118,110,0.08),transparent_45%)]" />

      <header className="relative z-10 border-b border-hairline/80 bg-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={assets.brand.logoIcon} alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-display text-base font-semibold tracking-tight text-ink">
              Academy Ops
            </span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted transition-colors hover:text-ink">
            ← Home
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_minmax(0,24rem)] lg:items-center lg:gap-16 lg:py-16 xl:grid-cols-[1.1fr_minmax(0,26rem)]">
        {aside && <div className="order-2 lg:order-1">{aside}</div>}
        <div className={cn("order-1 lg:order-2", !aside && "lg:col-span-2 lg:mx-auto lg:w-full lg:max-w-md")}>
          {children}
        </div>
      </div>

      <footer className="relative z-10 border-t border-hairline/60 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Academy Ops · Renewal control for sports academies
      </footer>
    </div>
  );
}

export function AuthCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-canvas p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
