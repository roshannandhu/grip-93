import MarketShell from "@/components/market/MarketShell";
import SellClient from "./SellClient";

export const metadata = { title: "Sell Your Tyres — GRIP 93" };

export default function SellPage() {
  return (
    <MarketShell>
      <SellClient />
    </MarketShell>
  );
}
