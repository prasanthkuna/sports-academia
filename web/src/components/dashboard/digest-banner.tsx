"use client";

import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export function DigestBanner({
  body,
  whatsappUrl,
  sent,
}: {
  body: string;
  whatsappUrl: string;
  sent: boolean;
}) {
  return (
    <Card className="border-brand/25 bg-brand-soft/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-brand">Owner digest</p>
          <p className="mt-1 text-sm text-body line-clamp-2">{body.split("\n")[0]}</p>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-active"
        >
          <MessageCircle className="h-4 w-4" />
          {sent ? "Resend on WhatsApp" : "Send on WhatsApp"}
        </a>
      </div>
    </Card>
  );
}
