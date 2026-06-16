"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateIdCards } from "@/app/actions";

export function IdCardsGenerator({ batches }: { batches: { id: string; name: string }[] }) {
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const cards = await generateIdCards(batchId);
    for (const card of cards) {
      const a = document.createElement("a");
      a.href = `data:application/pdf;base64,${card.base64}`;
      a.download = `${card.name.replace(/\s+/g, "-")}-id.pdf`;
      a.click();
    }
    setLoading(false);
  }

  return (
    <Card className="space-y-4 p-6">
      <div>
        <label className="text-xs font-medium uppercase text-muted">Batch</label>
        <select
          className="mt-1 h-11 w-full rounded-md border border-hairline px-3 text-sm"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        >
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={generate} disabled={loading || !batchId}>
        {loading ? "Generating…" : "Download all ID cards (PDF)"}
      </Button>
    </Card>
  );
}
