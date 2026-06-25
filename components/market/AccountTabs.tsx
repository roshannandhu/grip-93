"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/warranty", label: "Warranty" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function AccountTabs() {
  const path = usePathname();
  return (
    <div className="mb-8 flex flex-wrap gap-2 border-b hairline pb-3">
      {TABS.map((t) => {
        const active = path === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`rounded-lg px-4 py-2 font-display text-sm font-bold uppercase tracking-wide transition ${
              active ? "bg-flame text-[#120a04]" : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
