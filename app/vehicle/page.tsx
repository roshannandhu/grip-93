import MarketShell from "@/components/market/MarketShell";
import VehiclePicker from "@/components/market/VehiclePicker";

export const metadata = { title: "Search Tyres by Vehicle — GRIP 93" };

export default function VehiclePage() {
  return (
    <MarketShell>
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-extrabold md:text-5xl">Search by vehicle</h1>
        <p className="mt-2 text-white/55">Pick your make, model and year — we&apos;ll show used tyres in the right size.</p>
        <div className="mt-8 rounded-2xl glass p-6">
          <VehiclePicker />
        </div>
        <p className="mt-6 text-sm text-white/45">Don&apos;t see your vehicle? Use <a href="/size" className="text-flame">search by size</a> instead.</p>
      </div>
    </MarketShell>
  );
}
