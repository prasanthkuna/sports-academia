"use client";

import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/landing-config";

export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 md:bottom-6"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </a>
  );
}
