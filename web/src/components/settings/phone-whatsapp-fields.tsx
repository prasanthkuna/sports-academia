"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

export function PhoneWhatsappFields({
  defaultPhone = "",
  defaultWhatsapp = "",
}: {
  defaultPhone?: string;
  defaultWhatsapp?: string;
}) {
  const [phone, setPhone] = useState(defaultPhone);
  const [whatsapp, setWhatsapp] = useState(defaultWhatsapp);
  const [sameAsPhone, setSameAsPhone] = useState(
    !defaultWhatsapp || defaultWhatsapp.replace(/\D/g, "") === defaultPhone.replace(/\D/g, ""),
  );

  useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone);
  }, [sameAsPhone, phone]);

  return (
    <>
      <div>
        <label className="text-xs font-medium uppercase text-muted">Phone</label>
        <Input
          name="contact_number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1"
          placeholder="9876543210"
        />
      </div>
      <div>
        <label className="text-xs font-medium uppercase text-muted">WhatsApp</label>
        <Input
          name="whatsapp_number"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="mt-1"
          placeholder="919876543210"
          disabled={sameAsPhone}
        />
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-body">
          <input
            type="checkbox"
            checked={sameAsPhone}
            onChange={(e) => setSameAsPhone(e.target.checked)}
            className="h-4 w-4 rounded border-hairline accent-brand"
          />
          Same as phone number
        </label>
      </div>
    </>
  );
}
