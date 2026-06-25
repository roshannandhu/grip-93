const ITEMS = [
  { icon: "🔍", title: "12-Point Inspected", sub: "Every tyre checked" },
  { icon: "🏷️", title: "Graded A–D", sub: "Tread & age shown" },
  { icon: "🛡️", title: "7-Day Warranty", sub: "Easy returns" },
  { icon: "🚚", title: "Pan-India Delivery", sub: "To your pincode" },
];

export default function TrustStrip() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {ITEMS.map((i) => (
        <div key={i.title} className="flex items-center gap-3 rounded-2xl glass px-4 py-3">
          <span className="text-2xl">{i.icon}</span>
          <div>
            <div className="font-display text-sm font-bold leading-tight">{i.title}</div>
            <div className="text-xs text-white/50">{i.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
