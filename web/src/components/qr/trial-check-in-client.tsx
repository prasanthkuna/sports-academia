"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getBrowserLocation } from "@/lib/geofence";
import { trialCheckIn } from "@/app/actions";

export function TrialCheckInClient({ slug, token }: { slug: string; token: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleCheckIn() {
    setStatus("loading");
    try {
      const { lat, lng } = await getBrowserLocation();
      const result = await trialCheckIn(slug, token, lat, lng);
      if (result.ok) {
        setStatus("success");
        setMessage(`Welcome, ${result.lead_name}! Trial attendance recorded.`);
      } else {
        setStatus("error");
        setMessage(result.error ?? "Check-in failed");
      }
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Check-in failed");
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <Card className="p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-brand">Trial check-in</p>
        {status === "success" ? (
          <p className="mt-4 text-success">{message}</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">Tap below when you arrive at the academy.</p>
            <Button className="mt-6 w-full" onClick={handleCheckIn} disabled={status === "loading"}>
              {status === "loading" ? "Verifying location…" : "I have arrived"}
            </Button>
            {status === "error" && <p className="mt-3 text-sm text-error">{message}</p>}
          </>
        )}
      </Card>
    </div>
  );
}

export function KioskCheckInClient({
  slug,
  batchId,
  batchName,
}: {
  slug: string;
  batchId: string;
  batchName: string;
}) {
  const [studentCode, setStudentCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function lookupAndCheckIn() {
    setStatus("loading");
    try {
      const { lat, lng } = await import("@/lib/geofence").then((m) => m.getBrowserLocation());
      const res = await fetch(`/api/kiosk-check-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, batchId, studentCode, latitude: lat, longitude: lng }),
      });
      const data = await res.json();
      setStatus(data.ok ? `Welcome, ${data.student_name}!` : data.error);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Check-in failed");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-brand">Batch kiosk</p>
        <h1 className="font-display text-xl font-semibold text-ink">{batchName}</h1>
      </div>
      <Card className="space-y-3 p-6">
        <label className="text-xs font-medium uppercase text-muted">Student code</label>
        <Input
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value.toUpperCase())}
          placeholder="STU-0001"
          className="font-mono-amount"
        />
        <Button className="w-full" onClick={lookupAndCheckIn}>
          Check in
        </Button>
        {status && status !== "loading" && (
          <p className={`text-sm ${status.startsWith("Welcome") ? "text-success" : "text-error"}`}>
            {status}
          </p>
        )}
      </Card>
    </div>
  );
}
