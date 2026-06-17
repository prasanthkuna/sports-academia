import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginFormLoader } from "@/components/auth/login-form-loader";
import { landingConfig } from "@/lib/landing-config";

function LoginAside() {
  const { hero } = landingConfig;
  return (
    <div className="max-w-lg">
      <p className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
        {hero.badge}
      </p>
      <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink xl:text-4xl">
        Renewal control before the next batch starts
      </h2>
      <p className="mt-4 text-base leading-relaxed text-body">{hero.subhead}</p>
      <ul className="mt-8 space-y-3">
        {hero.chips.map((chip) => (
          <li key={chip} className="flex items-center gap-2.5 text-sm text-body">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
              ✓
            </span>
            {chip}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">{hero.trustLine}</p>
      <Link href="/#demo" className="mt-4 inline-block text-sm font-semibold text-brand hover:underline">
        See live demo flows →
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell aside={<LoginAside />}>
      <LoginFormLoader />
    </AuthShell>
  );
}
