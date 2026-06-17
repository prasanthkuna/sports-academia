import { AuthShell } from "@/components/auth/auth-shell";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { ProvisionFallback } from "@/components/onboarding/provision-fallback";
import { getAcademyContext } from "@/lib/auth";

export default async function OnboardingPage() {
  const ctx = await getAcademyContext();

  if (!ctx) {
    return (
      <AuthShell>
        <ProvisionFallback />
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <OnboardingWizard
        academyName={ctx.academyUser.academies.name}
        slug={ctx.academySlug}
        trialEndsAt={ctx.trialEndsAt}
        settings={ctx.settings}
      />
    </AuthShell>
  );
}
