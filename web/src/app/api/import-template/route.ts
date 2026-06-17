import { buildImportTemplateWorkbook } from "@/lib/import/template";

export async function GET() {
  const buffer = buildImportTemplateWorkbook();
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="academy-import-template.xlsx"',
    },
  });
}
