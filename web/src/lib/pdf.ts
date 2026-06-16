import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export async function generateQrDataUrl(text: string, size = 200) {
  return QRCode.toDataURL(text, { width: size, margin: 1, color: { dark: "#0F172A", light: "#FFFFFF" } });
}

export async function generateReceiptPdf(params: {
  academyName: string;
  receiptNumber: string;
  studentName: string;
  parentName: string;
  feeType: string;
  amount: number;
  paymentMode: string;
  paymentDate: string;
  pendingBalance: number;
  verifyUrl: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a5" });
  const qr = await generateQrDataUrl(params.verifyUrl, 120);

  doc.setFontSize(16);
  doc.text(params.academyName, 10, 15);
  doc.setFontSize(10);
  doc.text("Payment Receipt", 10, 22);
  doc.setFontSize(9);
  doc.text(`Receipt #: ${params.receiptNumber}`, 10, 30);
  doc.text(`Date: ${params.paymentDate}`, 10, 36);
  doc.text(`Student: ${params.studentName}`, 10, 44);
  doc.text(`Parent: ${params.parentName}`, 10, 50);
  doc.text(`Fee: ${params.feeType}`, 10, 58);
  doc.text(`Paid: Rs ${params.amount.toLocaleString("en-IN")}`, 10, 66);
  doc.text(`Mode: ${params.paymentMode}`, 10, 72);
  doc.text(`Balance pending: Rs ${params.pendingBalance.toLocaleString("en-IN")}`, 10, 80);
  doc.addImage(qr, "PNG", 95, 40, 35, 35);
  doc.setFontSize(7);
  doc.text("Scan to verify", 100, 78);

  return doc.output("arraybuffer");
}

export async function generateIdCardPdf(params: {
  academyName: string;
  brandColor: string;
  studentName: string;
  studentCode: string;
  batchName: string;
  sportName: string;
  parentMobile: string;
  checkInUrl: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: [85.6, 54] });
  const qr = await generateQrDataUrl(params.checkInUrl, 100);

  doc.setFillColor(15, 118, 110);
  doc.rect(0, 0, 85.6, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(params.academyName, 4, 8);
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(params.studentName, 4, 20);
  doc.setFontSize(8);
  doc.text(`${params.studentCode} · ${params.sportName}`, 4, 26);
  doc.text(`Batch: ${params.batchName}`, 4, 32);
  doc.text(`Parent: ${params.parentMobile}`, 4, 38);
  doc.addImage(qr, "PNG", 58, 16, 24, 24);
  doc.setFontSize(6);
  doc.text("Scan to check in", 58, 42);

  return doc.output("arraybuffer");
}

export function bufferToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}
