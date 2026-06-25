import Link from "next/link";
import { notFound } from "next/navigation";
import MarketShell from "@/components/market/MarketShell";
import ConditionReport from "@/components/market/ConditionReport";
import ListingCard from "@/components/market/ListingCard";
import { getListing, relatedListings, LISTINGS } from "@/lib/data";
import Gallery from "./Gallery";
import BuyBox from "./BuyBox";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const l = getListing(params.id);
  return { title: l ? `${l.brand} ${l.model} ${l.sizeLabel} — Used Tyre — GRIP 93` : "Tyre — GRIP 93" };
}

export default function TyrePage({ params }: { params: { id: string } }) {
  const listing = getListing(params.id);
  if (!listing) notFound();
  const related = relatedListings(listing);

  return (
    <MarketShell>
      <nav className="mb-5 text-sm text-white/45">
        <Link href="/shop" className="hover:text-flame">Browse</Link> / <span className="text-white/70">{listing.brand} {listing.model}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Gallery listing={listing} />
          <ConditionReport listing={listing} />
        </div>

        <div className="space-y-5">
          <div>
            <h1 className="font-display text-3xl font-extrabold md:text-4xl">{listing.brand} {listing.model}</h1>
            <div className="mt-1 font-display text-lg text-flame">{listing.sizeLabel} · {listing.loadIndex}{listing.speedRating} · <span className="capitalize">{listing.vehicleType}</span></div>
            <div className="mt-1 text-sm text-white/45">📍 {listing.city} · Sold by {listing.sellerType}</div>
          </div>
          <BuyBox listing={listing} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display mb-5 text-2xl font-extrabold">Similar tyres</h2>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        </section>
      )}
    </MarketShell>
  );
}
