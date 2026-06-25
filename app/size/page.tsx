import MarketShell from "@/components/market/MarketShell";
import SizePicker from "@/components/market/SizePicker";

export const metadata = { title: "Search Tyres by Size — GRIP 93" };

export default function SizePage() {
  return (
    <MarketShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Search by size</h1>
        <p className="mt-2 text-white/55">Find your size on the sidewall (e.g. <span className="text-flame">195/65 R15</span>) and pick the three values.</p>
        <div className="mt-8 rounded-2xl glass p-6">
          <SizePicker />
        </div>
        <div className="mt-6 rounded-2xl glass p-6 text-sm text-white/60">
          <h2 className="font-display text-lg font-bold text-white">How to read tyre size</h2>
          <ul className="mt-3 space-y-1.5">
            <li><b className="text-white">195</b> — section width in mm</li>
            <li><b className="text-white">65</b> — aspect ratio (sidewall height as % of width)</li>
            <li><b className="text-white">R15</b> — rim diameter in inches</li>
          </ul>
        </div>
      </div>
    </MarketShell>
  );
}
