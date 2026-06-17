"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DownloadTemplateButton({
  className,
  variant = "secondary",
}: {
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function download() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/import-template");
      if (!res.ok) throw new Error("Could not download template");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "academy-import-template.xlsx";
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant={variant}
        className={cn(className)}
        disabled={loading}
        onClick={download}
      >
        {loading ? "Downloading…" : "Download template"}
      </Button>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
      <p className="mt-1 text-xs text-muted">Opens in Excel or Google Sheets after download</p>
    </div>
  );
}
