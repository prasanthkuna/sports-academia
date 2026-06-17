import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { landingConfig } from "@/lib/landing-config";
import { TRIAL_DAYS } from "@/lib/subscription";

function SignupAside() {
  const { pricing } = landingConfig;
  const pro = pricing.plans.find((p) => p.id === "pro")!;

  return (
    <div className="max-w-lg">
      <p className="inline-flex items-center rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
        {TRIAL_DAYS}-day Pro trial · no card required
      </p>
      <h2 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight text-ink xl:text-4xl">
        Your academy live in one afternoon
      </h2>
      <p className="mt-4 text-base leading-relaxed text-body">
        Sign up as owner, import your Excel, and start tracking renewals, fees, and attendance.
        Full Pro access for {TRIAL_DAYS} days — then choose Starter or Pro.
      </p>
      <ul className="mt-8 space-y-3">
        {pro.features.slice(0, 6).map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-body">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <Link href="/login?role=owner" className="mt-8 inline-block text-sm font-semibold text-brand hover:underline">
        Or explore the demo first →
      </Link>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthShell aside={<SignupAside />}>
      <SignupForm />
    </AuthShell>
  );
}
