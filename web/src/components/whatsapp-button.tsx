"use client";

import { logWhatsApp } from "@/app/actions";

export function WhatsAppButton({
  studentId,
  phone,
  message,
  label = "WhatsApp",
  parentName,
  studentName,
}: {
  studentId?: string | null;
  phone: string;
  message?: string;
  label?: string;
  parentName?: string;
  studentName?: string;
}) {
  const body =
    message ??
    `Hello ${parentName ?? "there"}, this is regarding ${studentName ?? "your ward"} at our academy.`;
  const num = phone.replace(/\D/g, "").replace(/^0/, "91");
  const url = `https://wa.me/${num}?text=${encodeURIComponent(body)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={() => logWhatsApp(studentId ?? null, phone, "general", body)}
      className="inline-flex h-11 items-center rounded-md bg-[#25D366] px-4 text-sm font-semibold text-white"
    >
      {label}
    </a>
  );
}
