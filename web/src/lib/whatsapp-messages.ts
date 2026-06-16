import { formatCurrency, formatDate } from "@/lib/utils";

export function receiptMessage(params: {
  academyName: string;
  studentName: string;
  amount: number;
  receiptNumber: string;
  paymentDate: string;
}) {
  return `Receipt from ${params.academyName}

Student: ${params.studentName}
Amount: ${formatCurrency(params.amount)}
Receipt #: ${params.receiptNumber}
Date: ${formatDate(params.paymentDate)}

Thank you for your payment.`;
}

export function reviewBoosterMessage(params: {
  academyName: string;
  reviewLink: string;
}) {
  return `Thank you for choosing ${params.academyName}! If you had a good experience, we'd appreciate a quick Google review: ${params.reviewLink}`;
}

export function checkInConfirmationMessage(params: {
  studentName: string;
  batchName: string;
  academyName: string;
  time: string;
}) {
  return `${params.studentName} checked in for ${params.batchName} at ${params.academyName} (${params.time}).`;
}

export function trialLinkMessage(params: {
  academyName: string;
  trialDate: string;
  link: string;
}) {
  return `Your trial at ${params.academyName} is on ${params.trialDate}. Check in when you arrive: ${params.link}`;
}

export function feeReminderMessage(params: {
  academyName: string;
  studentName: string;
  pendingAmount: number;
  dueDate: string;
}) {
  return `Fee reminder from ${params.academyName}

Student: ${params.studentName}
Pending: ${formatCurrency(params.pendingAmount)}
Due: ${formatDate(params.dueDate)}

Please contact us to complete payment.`;
}

export function ownerDigestMessage(params: {
  academyName: string;
  date: string;
  collected: number;
  present: number;
  totalStudents: number;
  qrCheckIns: number;
  manualCheckIns: number;
  overdueAmount: number;
  overdueCount: number;
  newLeads: number;
  trialsAttended: number;
}) {
  return `${params.academyName} — ${params.date}
Collected: ${formatCurrency(params.collected)} | Present: ${params.present}/${params.totalStudents}
QR check-ins: ${params.qrCheckIns} | Manual: ${params.manualCheckIns}
Overdue: ${formatCurrency(params.overdueAmount)} (${params.overdueCount} students)
New leads: ${params.newLeads} | Trials attended: ${params.trialsAttended}`;
}
