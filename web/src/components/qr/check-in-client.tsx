"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getBrowserLocation } from "@/lib/geofence";
import { qrCheckIn } from "@/app/actions";

type Batch = { id: string; name: string; start_time: string | null; end_time: string | null };

export function CheckInClient({
  slug,
  token,
  studentName,
  batches,
  pinRequired,
}: {
  slug: string;
  token: string;
  studentName: string;
  batches: Batch[];
  pinRequired: boolean;
}) {
  const [pin, setPin] = useState("");
  const [batchId, setBatchId] = useState(batches[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleCheckIn() {
    setStatus("loading");
    try {
      const { lat, lng } = await getBrowserLocation();
      const result = await qrCheckIn(slug, token, batchId, pinRequired ? pin : null, lat, lng);
      if (result.ok) {
        setStatus("success");
        setMessage(`Checked in for ${result.batch_name}`);
      } else {
        setStatus("error");
        setMessage(result.error ?? "Check-in failed");
      }
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Location or check-in failed");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-brand">QR Check-in</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">{studentName}</h1>
        <p className="mt-1 text-sm text-muted">Confirm attendance at the academy</p>
      </div>

      {status === "success" ? (
        <Card className="border-success/30 bg-success-soft p-6 text-center">
          <p className="text-lg font-semibold text-success">Present marked</p>
          <p className="mt-2 text-sm text-body">{message}</p>
        </Card>
      ) : (
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
                  {b.start_time ? ` · ${b.start_time.slice(0, 5)}` : ""}
                </option>
              ))}
            </select>
          </div>
          {pinRequired && (
            <div>
              <label className="text-xs font-medium uppercase text-muted">PIN (last 4 of mobile)</label>
              <Input
                className="mt-1 font-mono-amount"
                maxLength={4}
                inputMode="numeric"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
              />
            </div>
          )}
          <p className="text-xs text-muted">
            Location access required — you must be at the academy to check in.
          </p>
          <Button
            className="w-full"
            disabled={status === "loading" || (pinRequired && pin.length < 4)}
            onClick={handleCheckIn}
          >
            {status === "loading" ? "Checking in…" : "Mark present"}
          </Button>
          {status === "error" && <p className="text-sm text-error">{message}</p>}
        </Card>
      )}
    </div>
  );
}
