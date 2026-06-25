import MarketShell from "@/components/market/MarketShell";
import Prose from "@/components/market/Prose";
import { PAGES } from "@/lib/content";

const p = PAGES["shipping"];
export const metadata = { title: `${p.title} — GRIP 93` };
export default function Page() {
  return <MarketShell><Prose {...p} /></MarketShell>;
}
