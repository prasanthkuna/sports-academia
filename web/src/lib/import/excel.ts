import * as XLSX from "xlsx";
import { STARTER_LIMITS } from "@/lib/plans";

export type ImportEntity = "students" | "batches" | "fees" | "leads" | "coaches";

export type ColumnMapping = {
  entity: ImportEntity;
  sheet: string;
  mapping: Record<string, string>;
};

const COLUMN_SYNONYMS: Record<string, string[]> = {
  name: ["name", "student name", "student", "full name"],
  parent_name: ["parent", "parent name", "father", "guardian"],
  mobile: ["mobile", "phone", "cell", "contact", "parent mobile"],
  whatsapp: ["whatsapp", "wa"],
  batch_name: ["batch", "batch name", "group", "class"],
  sport_name: ["sport", "game", "discipline"],
  amount: ["amount", "fee", "fees", "pending", "due amount"],
  due_date: ["due date", "due", "deadline"],
  email: ["email", "mail"],
  designation: ["designation", "role", "title"],
  capacity: ["capacity", "max students"],
  start_time: ["start", "start time", "from"],
  end_time: ["end", "end time", "to"],
  notes: ["notes", "remark", "comments"],
  trial_date: ["trial date", "trial"],
};

export function detectHeaderRow(rows: unknown[][]) {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    if (!Array.isArray(row)) continue;
    const textCells = row.filter((c) => typeof c === "string" && String(c).trim().length > 0);
    if (textCells.length >= 2) return i;
  }
  return 0;
}

export function normalizeHeader(h: string) {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

export function autoMapColumns(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  for (const [field, synonyms] of Object.entries(COLUMN_SYNONYMS)) {
    for (const header of headers) {
      const norm = normalizeHeader(header);
      if (synonyms.includes(norm) || norm.includes(field.replace("_", " "))) {
        mapping[field] = header;
        break;
      }
    }
  }
  return mapping;
}

export function classifySheet(name: string, headers: string[]): ImportEntity {
  const n = name.toLowerCase();
  const h = headers.map(normalizeHeader).join(" ");
  if (n.includes("batch") || h.includes("capacity") || h.includes("start time")) return "batches";
  if (n.includes("fee") || h.includes("due date") || h.includes("pending")) return "fees";
  if (n.includes("lead") || h.includes("trial")) return "leads";
  if (n.includes("coach") || h.includes("designation")) return "coaches";
  return "students";
}

export function parseWorkbook(buffer: ArrayBuffer) {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true });
  return wb.SheetNames.map((sheetName) => {
    const sheet = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" }) as unknown[][];
    const headerIdx = detectHeaderRow(rows);
    const headers = (rows[headerIdx] as unknown[]).map((c) => String(c ?? "").trim()).filter(Boolean);
    const dataRows = rows.slice(headerIdx + 1).filter((r) =>
      Array.isArray(r) && r.some((c) => c !== "" && c != null),
    );
    const entity = classifySheet(sheetName, headers);
    const mapping = autoMapColumns(headers);
    return { sheetName, headers, dataRows, entity, mapping };
  });
}

export function rowToObject(headers: string[], row: unknown[]) {
  const obj: Record<string, unknown> = {};
  headers.forEach((h, i) => {
    obj[h] = row[i];
  });
  return obj;
}

export function getMappedValue(row: Record<string, unknown>, mapping: Record<string, string>, field: string) {
  const col = mapping[field];
  if (!col) return undefined;
  const v = row[col];
  return v == null || v === "" ? undefined : String(v).trim();
}

export function normalizeMobile(m: string) {
  const digits = m.replace(/\D/g, "");
  if (digits.length === 10) return digits;
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  return digits;
}

export function exportErrorsWorkbook(errors: { row: number; reason: string; data: Record<string, unknown> }[]) {
  const ws = XLSX.utils.json_to_sheet(
    errors.map((e) => ({ row: e.row, reason: e.reason, ...e.data })),
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Errors");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}

export { STARTER_LIMITS };
