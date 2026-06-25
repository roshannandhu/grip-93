"use client";

import Link from "next/link";
import { useState } from "react";
import { useMarket } from "@/lib/store";

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/compare", label: "Compare" },
];
const ACCOUNT = [
  { href: "/account", label: "Dashboard" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/warranty", label: "Warranty" },
  { href: "/wishlist", label: "Wishlist" },
];

export default function SiteNav() {
  const { cartCount, wishlist, openCart } = useMarket();
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

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">
              {l.label}
            </Link>
          ))}
          {/* account dropdown */}
          <div className="group relative">
            <button className="rounded-lg px-3 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">Account ▾</button>
            <div className="invisible absolute right-0 top-full pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="w-44 rounded-xl glass p-2">
                {ACCOUNT.map((a) => (
                  <Link key={a.href} href={a.href} className="block rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-flame">{a.label}</Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-1.5">
          <Link href="/wishlist" className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-flame" aria-label="Wishlist">
            ♡
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-[#120a04]">{wishlist.length}</span>
            )}
          </Link>
          <button onClick={openCart} className="relative grid h-9 w-9 place-items-center rounded-lg text-white/70 transition hover:bg-white/5 hover:text-flame" aria-label="Cart">
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-flame px-1 text-[10px] font-bold text-[#120a04]">{cartCount}</span>
            )}
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-lg text-white lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
        </div>
      </div>

      {open && (
        <div className="mx-4 mt-2 rounded-xl glass p-2 lg:hidden">
          {[...LINKS, ...ACCOUNT].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 text-white/75">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
