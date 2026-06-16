"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { convertLead } from "@/app/actions";

export function ConvertLeadButton({
  leadId,
  batches,
}: {
  leadId: string;
  batches: { id: string; name: string }[];
}) {
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  async function onConvert() {
    if (!batchId) return;
    setLoading(true);
    await convertLead(leadId, batchId);
    window.location.reload();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        className="h-10 rounded-md border border-hairline px-2 text-sm"
      >
        {batches.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <Button type="button" onClick={onConvert} disabled={loading}>
        Convert
      </Button>
    </div>
  );
}
