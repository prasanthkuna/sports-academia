"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { runSmartImport } from "@/app/actions";
import type { AcademyPlan } from "@/lib/plans";

export function ImportWizard({ plan, proAccess }: { plan: AcademyPlan; proAccess: boolean }) {
  const [result, setResult] = useState<{
    successCount: number;
    errorCount: number;
    errorFileBase64?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!proAccess) {
    return (
      <Card className="p-6 text-center text-muted">
        Upgrade to Pro for unlimited smart Excel import.
      </Card>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await runSmartImport(fd);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  function downloadErrors() {
    if (!result?.errorFileBase64) return;
    const a = document.createElement("a");
    a.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${result.errorFileBase64}`;
    a.download = "import-errors.xlsx";
    a.click();
  }

  return (
    <Card className="p-6">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium uppercase text-muted">Spreadsheet (.xlsx, .csv)</label>
          <input
            type="file"
            name="file"
            accept=".xlsx,.xls,.csv"
            required
            className="mt-2 block w-full text-sm"
          />
        </div>
        <p className="text-xs text-muted">
          We auto-detect sheets for students, batches, fees, leads, and coaches. Column names like Name,
          Mobile, Batch are mapped automatically.{" "}
          <a href="/api/import-template" className="font-medium text-brand hover:underline">
            Download template
          </a>
        </p>
        <Button type="submit" disabled={loading}>
          {loading ? "Importing…" : "Upload & import"}
        </Button>
      </form>
      {error && <p className="mt-3 text-sm text-error">{error}</p>}
      {result && (
        <div className="mt-4 rounded-md bg-success-soft p-4 text-sm">
          <p>
            Imported {result.successCount} rows
            {result.errorCount > 0 && ` · ${result.errorCount} errors`}
          </p>
          {result.errorFileBase64 && (
            <Button type="button" variant="ghost" className="mt-2" onClick={downloadErrors}>
              Download error report
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
