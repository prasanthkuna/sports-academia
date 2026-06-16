"use client";

import { Card } from "@/components/ui/card";
import { waLink } from "@/lib/utils";
import { markReminderSent } from "@/app/actions";

export function RemindersList({
  items,
}: {
  items: {
    id: string;
    recipient_name: string | null;
    recipient_mobile: string;
    whatsapp_body: string;
    reminder_type: string;
  }[];
}) {
  if (items.length === 0) {
    return <Card className="p-6 text-center text-muted">No pending reminders today.</Card>;
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-ink">{item.recipient_name ?? item.recipient_mobile}</p>
            <p className="text-xs capitalize text-muted">{item.reminder_type.replace("_", " ")}</p>
          </div>
          <div className="flex gap-2">
            <a
              href={waLink(item.recipient_mobile, item.whatsapp_body)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-success px-4 py-2 text-sm font-semibold text-white"
              onClick={() => markReminderSent(item.id)}
            >
              Send WhatsApp
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
