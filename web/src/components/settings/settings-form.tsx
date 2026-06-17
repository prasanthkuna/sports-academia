"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneWhatsappFields } from "@/components/settings/phone-whatsapp-fields";
import { saveAcademySettings } from "@/app/actions";
import type { AcademySettings } from "@/types";

export function SettingsForm({
  settings,
  academyName,
  slug,
}: {
  settings: AcademySettings | null;
  academyName: string;
  slug: string;
}) {
  const [saved, setSaved] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await saveAcademySettings(new FormData(e.currentTarget));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-hairline bg-canvas p-6">
      <div>
        <h2 className="font-semibold text-ink">Academy</h2>
        <p className="text-sm text-muted">{academyName} · {slug}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <PhoneWhatsappFields
          defaultPhone={settings?.contact_number ?? ""}
          defaultWhatsapp={settings?.whatsapp_number ?? ""}
        />
        <div className="sm:col-span-2">
          <label className="text-xs font-medium uppercase text-muted">Address</label>
          <Input name="address" defaultValue={settings?.address ?? ""} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium uppercase text-muted">Email</label>
          <Input name="email" type="email" defaultValue={settings?.email ?? ""} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium uppercase text-muted">Receipt prefix</label>
          <Input name="receipt_prefix" defaultValue={settings?.receipt_prefix ?? "KCA"} className="mt-1" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium uppercase text-muted">Google review link</label>
          <Input name="google_review_link" defaultValue={settings?.google_review_link ?? ""} className="mt-1" />
        </div>
      </div>

      <div className="border-t border-hairline-soft pt-6">
        <h3 className="font-semibold text-ink">QR check-in & geofence</h3>
        <p className="mt-1 text-sm text-muted">Required for student scan attendance (Pro)</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase text-muted">Latitude</label>
            <Input
              name="latitude"
              type="number"
              step="any"
              required
              defaultValue={settings?.latitude ?? ""}
              className="mt-1 font-mono-amount"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-muted">Longitude</label>
            <Input
              name="longitude"
              type="number"
              step="any"
              required
              defaultValue={settings?.longitude ?? ""}
              className="mt-1 font-mono-amount"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-muted">Geofence radius (m)</label>
            <Input
              name="geofence_radius_m"
              type="number"
              defaultValue={settings?.geofence_radius_m ?? 200}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-muted">Digest time</label>
            <Input
              name="digest_time"
              type="time"
              defaultValue={(settings?.digest_time ?? "20:00:00").slice(0, 5)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="geofence_required" defaultChecked={settings?.geofence_required ?? true} />
            Geofence required
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="qr_checkin_enabled" defaultChecked={settings?.qr_checkin_enabled ?? true} />
            QR check-in enabled
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="checkin_pin_required" defaultChecked={settings?.checkin_pin_required ?? true} />
            PIN required
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="reminders_enabled" defaultChecked={settings?.reminders_enabled ?? true} />
            Reminders enabled
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium uppercase text-muted">Window before (min)</label>
            <Input
              name="checkin_window_before_min"
              type="number"
              defaultValue={settings?.checkin_window_before_min ?? 30}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase text-muted">Window after (min)</label>
            <Input
              name="checkin_window_after_min"
              type="number"
              defaultValue={settings?.checkin_window_after_min ?? 15}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Button type="submit">{saved ? "Saved" : "Save settings"}</Button>
    </form>
  );
}
