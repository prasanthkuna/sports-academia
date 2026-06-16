"use client";

import { logWhatsApp } from "@/app/actions";

export function WhatsAppButton({
  studentId,
  phone,
  parentName,
  studentName,
}: {
  studentId: string;
  phone: string;
  parentName: string;
  studentName: string;
}) {
  const message = `Hello ${parentName}, this is regarding ${studentName} at our academy.`;
  const num = phone.replace(/\D/g, "").replace(/^0/, "91");
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={() => logWhatsApp(studentId, phone, "general", message)}
      className="inline-flex h-11 items-center rounded-md bg-[#25D366] px-4 text-sm font-semibold text-white"
    >
      WhatsApp
    </a>
  );
}
