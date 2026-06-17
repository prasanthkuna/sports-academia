import { AuthShell } from "@/components/auth/auth-shell";
import { UpgradePageClient } from "@/components/billing/upgrade-page";
import { isRazorpayConfigured } from "@/lib/billing/razorpay";
import { getAcademyContext } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UpgradeRoute() {
  const ctx = await getAcademyContext();
  if (!ctx) redirect("/login");
  if (!ctx.subscriptionExpired) redirect("/dashboard");

  return (
    <AuthShell>
      <UpgradePageClient
        academyName={ctx.academyUser.academies.name}
        trialEndedAt={ctx.trialEndsAt}
        razorpayEnabled={isRazorpayConfigured()}
      />
    </AuthShell>
  );
}
