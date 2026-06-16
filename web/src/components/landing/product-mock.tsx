export function ProductMock() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-ink/5 blur-2xl" />
      <div className="relative rounded-[2.25rem] border border-hairline bg-ink p-2 shadow-2xl shadow-ink/20">
        <div className="overflow-hidden rounded-[1.75rem] bg-canvas">
          <div className="flex items-center justify-between bg-surface-soft px-4 py-2">
            <span className="text-[10px] font-medium text-muted">9:41</span>
            <span className="text-[10px] font-semibold text-ink">KCA Dashboard</span>
            <span className="h-2 w-6 rounded-full bg-hairline" />
          </div>
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-success-soft p-3">
                <p className="text-[10px] text-muted">Present today</p>
                <p className="font-mono-amount text-lg font-semibold text-ink">142</p>
              </div>
              <div className="rounded-lg bg-brand-soft p-3">
                <p className="text-[10px] text-muted">Collected</p>
                <p className="font-mono-amount text-lg font-semibold text-brand">₹8,240</p>
              </div>
            </div>
            <div className="rounded-lg border border-hairline p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-ink">Arjun Reddy</p>
                  <p className="text-[10px] text-muted">U12 Morning · ₹2,500 due</p>
                </div>
                <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white">
                  Collect
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-[#25D366]/30 bg-[#25D366]/5 p-3">
              <p className="text-[10px] font-medium text-[#128C7E]">Receipt sent on WhatsApp</p>
              <p className="mt-1 text-[10px] text-body">RCP-2026-0042 · ₹2,500 paid</p>
            </div>
            <div className="flex gap-1.5">
              {["Dashboard", "Fees", "Students", "More"].map((tab, i) => (
                <div
                  key={tab}
                  className={`flex-1 rounded-md py-1.5 text-center text-[9px] font-medium ${
                    i === 1 ? "bg-ink text-white" : "bg-surface-soft text-muted"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
