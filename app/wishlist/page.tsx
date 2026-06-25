"use client";

import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import ListingCard from "@/components/market/ListingCard";
import { useMarket } from "@/lib/store";
import { getListing } from "@/lib/data";

export default function WishlistPage() {
  const { wishlist, ready } = useMarket();
  const items = wishlist.map(getListing).filter(Boolean);

  return (
    <MarketShell>
      <h1 className="font-display mb-6 text-4xl font-extrabold md:text-5xl">Your wishlist</h1>
      {ready && items.length === 0 ? (
        <div className="grid place-items-center rounded-2xl glass p-16 text-center">
          <div>
            <div className="text-5xl">♡</div>
            <p className="mt-4 text-white/55">No saved tyres yet. Tap the heart on any listing.</p>
            <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-flame px-7 py-3.5 font-display font-bold uppercase tracking-wide text-[#120a04]">Browse tyres →</Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((l) => <ListingCard key={l!.id} listing={l!} />)}
        </div>
      )}
    </MarketShell>
  );
}
