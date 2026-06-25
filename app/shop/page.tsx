import { Suspense } from "react";
import MarketShell from "@/components/market/MarketShell";
import ShopClient from "./ShopClient";

export const metadata = { title: "Browse Used Tyres — GRIP 93" };

export default function ShopPage() {
  return (
    <MarketShell>
      <Suspense fallback={<div className="py-24 text-center text-white/50">Loading tyres…</div>}>
        <ShopClient />
      </Suspense>
    </MarketShell>
  );
}
