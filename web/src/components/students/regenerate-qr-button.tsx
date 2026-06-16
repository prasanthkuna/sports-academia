"use client";

import { Button } from "@/components/ui/button";
import { regenerateStudentQr } from "@/app/actions";

export function RegenerateQrButton({ studentId }: { studentId: string }) {
  async function regen() {
    await regenerateStudentQr(studentId);
    window.location.reload();
  }
  return (
    <Button type="button" variant="ghost" onClick={regen}>
      Regenerate QR
    </Button>
  );
}
