import Link from "next/link";

const COLS: { title: string; links: [string, string][] }[] = [
  {
    title: "Shop",
    links: [["Browse all", "/shop"], ["By vehicle", "/vehicle"], ["By size", "/size"], ["Wishlist", "/wishlist"], ["Compare", "/compare"]],
  },
  {
    title: "Sell & Trust",
    links: [["Sell your tyres", "/sell"], ["How we inspect", "/how-we-inspect"], ["Buying guide", "/buying-guide"], ["Warranty & returns", "/warranty"]],
  },
  {
    title: "Company",
    links: [["About us", "/about"], ["Contact", "/contact"], ["Blog", "/blog"], ["FAQ", "/faq"]],
  },
  {
    title: "Policies",
    links: [["Shipping & delivery", "/shipping"], ["Refund & returns", "/returns"], ["Terms", "/terms"], ["Privacy", "/privacy"]],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative z-20 mt-24 border-t hairline bg-ink-800/70">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5 font-display text-2xl font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-full border-[3px] border-flame shadow-flame">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
              </span>
              GRIP <span className="text-flame">93</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/55">
              India&apos;s trusted marketplace for certified second-hand tyres. Every tyre 12-point inspected,
              graded, and delivered to your pincode.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white/80">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-white/55 transition hover:text-flame">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t hairline pt-6 text-sm text-white/40 md:flex-row">
          <span>© 2026 GRIP 93 Tyre Marketplace · Made in India 🇮🇳</span>
          <span className="font-display uppercase tracking-widest">Certified Used Tyres · Delivered</span>
        </div>
      </div>
    </footer>
  );
}
