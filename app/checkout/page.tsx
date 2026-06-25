import MarketShell from "@/components/market/MarketShell";
import CheckoutClient from "./CheckoutClient";

export const metadata = { title: "Checkout — GRIP 93" };

export default function CheckoutPage() {
  return (
    <MarketShell>
      <CheckoutClient />
    </MarketShell>
  );
}
