import { AuthShell, AuthCard } from "@/components/auth/auth-shell";
import { PlansContent } from "@/components/billing/plans-content";
import { isRazorpayConfigured } from "@/lib/billing/razorpay";
import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UpgradeRoute() {
  const ctx = await getAcademyContext();
  if (!ctx) redirect("/login");
  if (!ctx.subscriptionExpired) redirect("/plans");

  return (
    <AuthShell>
      <AuthCard className="max-w-lg">
        <PlansContent
          academyName={ctx.academyUser.academies.name}
          trialEndsAt={ctx.trialEndsAt}
          subscriptionStatus={ctx.subscriptionStatus}
          currentPlan={ctx.plan}
          razorpayEnabled={isRazorpayConfigured()}
          canPay
        />
      </AuthCard>
    </AuthShell>
  );
}
