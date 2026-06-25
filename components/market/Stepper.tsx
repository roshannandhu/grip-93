const STEPS = ["Placed", "Inspected", "Shipped", "Delivered"] as const;

export default function Stepper({ current }: { current: (typeof STEPS)[number] }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`grid h-9 w-9 place-items-center rounded-full font-display text-sm font-bold ${
                i <= idx ? "bg-flame text-[#120a04]" : "border border-white/20 text-white/40"
              }`}
            >
              {i < idx ? "✓" : i + 1}
            </div>
            <span className={`mt-1.5 text-xs ${i <= idx ? "text-white" : "text-white/40"}`}>{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-2 h-0.5 flex-1 ${i < idx ? "bg-flame" : "bg-white/15"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
