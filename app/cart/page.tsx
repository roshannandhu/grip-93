import MarketShell from "@/components/market/MarketShell";
import CartClient from "./CartClient";

export const metadata = { title: "Cart — GRIP 93" };

export default function CartPage() {
  return (
    <MarketShell>
      <CartClient />
    </MarketShell>
  );
}
