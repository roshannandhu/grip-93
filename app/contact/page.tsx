import MarketShell from "@/components/market/MarketShell";
import ContactClient from "./ContactClient";

export const metadata = { title: "Contact — GRIP 93" };

export default function ContactPage() {
  return (
    <MarketShell>
      <ContactClient />
    </MarketShell>
  );
}
