"use client";

import Link from "next/link";
import { useState } from "react";
import { useMarket } from "@/lib/store";

const LINKS = [
  { href: "/shop", label: "Browse" },
  { href: "/vehicle", label: "By Vehicle" },
  { href: "/size", label: "By Size" },
  { href: "/sell", label: "Sell" },
  { href: "/how-we-inspect", label: "How We Inspect" },
];

export default function SiteNav() {
  const { cartCount, wishlist } = useMarket();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto mt-3 flex h-[58px] max-w-7xl items-center justify-between gap-3 rounded-2xl glass px-4 md:px-5">
        <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="grid h-7 w-7 place-items-center rounded-full border-[3px] border-flame shadow-flame">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          GRIP <span className="text-flame">93</span>
        </Link>

        <nav className="hidden gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/wishlist" className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-flame" aria-label="Wishlist">
            ♡
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-[#120a04]">{wishlist.length}</span>
            )}
          </Link>
          <Link href="/cart" className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-flame" aria-label="Cart">
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-[#120a04]">{cartCount}</span>
            )}
          </Link>
          <Link href="/account" className="hidden h-9 place-items-center rounded-lg px-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:grid">Account</Link>
          <button className="grid h-9 w-9 place-items-center rounded-lg text-white lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-xl glass p-2 lg:hidden">
          {[...LINKS, { href: "/account", label: "Account" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-white/75">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
