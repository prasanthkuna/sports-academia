const faqs = [
  {
    q: "Do I need a computer to run the academy?",
    a: "No. The core loop — attendance, fees, receipts, WhatsApp — is built for phones and tablets. Use a laptop for reports and bulk imports when you need them.",
  },
  {
    q: "Can parents pay online?",
    a: "You record cash or UPI payments in the app and send a receipt. Online payment gateway integration is on the roadmap; today the focus is fast on-ground collection.",
  },
  {
    q: "Is my academy data separate from others?",
    a: "Yes. Each academy is isolated. Your students, fees, and staff only see your data.",
  },
  {
    q: "Do I get a public page for enquiries?",
    a: "Every academy gets a shareable page at /a/your-slug with an enquiry form — perfect for WhatsApp bio links and Google Maps.",
  },
  {
    q: "Can I import students from Excel?",
    a: "Yes. Bulk student import from spreadsheet is part of core scope so you are not re-typing hundreds of names.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Frequently asked questions
        </h2>
        <dl className="mt-10 divide-y divide-hairline">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-5">
              <dt className="font-display text-base font-semibold text-ink">{faq.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-body">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
