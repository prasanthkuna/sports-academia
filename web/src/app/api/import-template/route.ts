import { buildImportTemplateWorkbook } from "@/lib/import/template";

export async function GET() {
  const buffer = buildImportTemplateWorkbook();
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="academy-import-template.xlsx"',
      "Cache-Control": "no-store",
    },
  });
}
