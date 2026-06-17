import Link from "next/link";
import { AuthShell, AuthCard } from "@/components/auth/auth-shell";
import { getAcademyContext } from "@/lib/auth";
import { planLabel } from "@/lib/plans";
import { redirect } from "next/navigation";

export default async function UpgradeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const ctx = await getAcademyContext();
  if (!ctx) redirect("/login");

  const { plan } = await searchParams;
  const planName = plan === "starter" || plan === "pro" ? planLabel(plan) : planLabel(ctx.effectivePlan);

  return (
    <AuthShell>
      <AuthCard className="max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-success">Payment received</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          {ctx.academyUser.academies.name} is live
        </h1>
        <p className="mt-3 text-sm text-body">
          Your {planName} plan is active. Import students, collect fees, and run renewals from your
          dashboard.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-md bg-ink px-5 text-sm font-semibold text-white hover:bg-ink-active"
        >
          Open dashboard
        </Link>
      </AuthCard>
    </AuthShell>
  );
}
