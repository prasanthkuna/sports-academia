"use client";

import { use, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EnquirePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("submit_enquiry", {
      p_slug: slug,
      p_name: fd.get("name"),
      p_parent_name: fd.get("parent_name"),
      p_mobile: fd.get("mobile"),
      p_whatsapp: fd.get("whatsapp") || fd.get("mobile"),
      p_sport: fd.get("sport"),
      p_age: fd.get("age") ? Number(fd.get("age")) : null,
      p_preferred_batch: fd.get("preferred_batch"),
      p_message: fd.get("message"),
    });
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-ink">Thank you!</h1>
          <p className="mt-2 text-muted">We&apos;ll contact you on WhatsApp soon.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-3 rounded-xl border p-6">
        <h1 className="text-xl font-semibold text-ink">Trial enquiry</h1>
        <Input name="name" placeholder="Student name" required />
        <Input name="parent_name" placeholder="Parent name" required />
        <Input name="mobile" placeholder="Mobile" required />
        <Input name="whatsapp" placeholder="WhatsApp (optional)" />
        <Input name="sport" placeholder="Sport interested" />
        <Input name="age" type="number" placeholder="Age" />
        <Input name="preferred_batch" placeholder="Preferred batch time" />
        <Input name="message" placeholder="Message" />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </main>
  );
}
