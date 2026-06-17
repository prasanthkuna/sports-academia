import * as XLSX from "xlsx";

export function buildImportTemplateWorkbook() {
  const batches = [
    {
      "Batch Name": "Morning U-12",
      Sport: "Cricket",
      "Start Time": "06:00",
      "End Time": "08:00",
      Capacity: 20,
    },
    {
      "Batch Name": "Evening Seniors",
      Sport: "Cricket",
      "Start Time": "17:00",
      "End Time": "19:00",
      Capacity: 15,
    },
  ];

  const students = [
    {
      Name: "Arjun Kumar",
      "Parent Name": "Suresh Kumar",
      Mobile: "9876543210",
      WhatsApp: "9876543210",
      "Batch Name": "Morning U-12",
    },
    {
      Name: "Kavya Reddy",
      "Parent Name": "Lakshmi Reddy",
      Mobile: "9876501234",
      WhatsApp: "9876501234",
      "Batch Name": "Evening Seniors",
    },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(batches), "Batches");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students), "Students");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
}
