"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateLeadStatus, generateTrialLink } from "@/app/actions";
import type { LeadStatus } from "@/types";
import type { AcademyPlan } from "@/lib/plans";
import { waLink } from "@/lib/utils";
import { trialLinkMessage } from "@/lib/whatsapp-messages";

const NEXT_STATUS: Partial<Record<LeadStatus, LeadStatus>> = {
  new_enquiry: "contacted",
  contacted: "trial_booked",
  trial_booked: "trial_attended",
  trial_attended: "follow_up_pending",
  follow_up_pending: "converted",
};

export function LeadActions({
  leadId,
  status,
  plan,
  slug,
}: {
  leadId: string;
  status: LeadStatus;
  plan: AcademyPlan;
  slug: string;
}) {
  const [trialLink, setTrialLink] = useState<string | null>(null);

  async function advance() {
    const next = NEXT_STATUS[status];
    if (next) await updateLeadStatus(leadId, next);
    window.location.reload();
  }

  async function createTrialLink() {
    const link = await generateTrialLink(leadId);
    setTrialLink(link);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {NEXT_STATUS[status] && (
        <Button type="button" variant="secondary" onClick={advance}>
          → {NEXT_STATUS[status]?.replace(/_/g, " ")}
        </Button>
      )}
      {plan === "pro" && status !== "trial_attended" && (
        <Button type="button" variant="ghost" onClick={createTrialLink}>
          Trial link
        </Button>
      )}
      {trialLink && (
        <a
          href={waLink(
            "",
            trialLinkMessage({
              academyName: slug,
              trialDate: new Date().toLocaleDateString("en-IN"),
              link: trialLink,
            }),
          )}
          className="text-xs text-brand underline"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(trialLink);
          }}
        >
          Copy trial link
        </a>
      )}
    </div>
  );
}
