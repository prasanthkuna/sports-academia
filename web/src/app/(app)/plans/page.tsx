import { PlansContent } from "@/components/billing/plans-content";
import { isRazorpayConfigured } from "@/lib/billing/razorpay";
import { getAcademyContext } from "@/lib/auth";
import { canManageTeam } from "@/lib/permissions";
import { redirect } from "next/navigation";

export default async function PlansPage() {
  const ctx = await getAcademyContext();
  if (!ctx || !canManageTeam(ctx.role)) redirect("/dashboard");

  const canPay =
    ctx.subscriptionStatus === "trial" || ctx.subscriptionStatus === "expired";

  return (
    <div className="mx-auto max-w-lg">
      <PlansContent
        academyName={ctx.academyUser.academies.name}
        trialEndsAt={ctx.trialEndsAt}
        subscriptionStatus={ctx.subscriptionStatus}
        currentPlan={ctx.plan}
        razorpayEnabled={isRazorpayConfigured()}
        canPay={canPay}
      />
    </div>
  );
}
