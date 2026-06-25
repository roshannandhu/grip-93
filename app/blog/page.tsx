import Link from "next/link";
import MarketShell from "@/components/market/MarketShell";
import { POSTS } from "@/lib/content";

export const metadata = { title: "Blog & Resources — GRIP 93" };

export default function BlogPage() {
  return (
    <MarketShell>
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Blog &amp; resources</h1>
      <p className="mt-2 text-white/55">Tyre safety, buying tips and care guides.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="flex flex-col rounded-2xl glass p-6 transition hover:border-flame/40">
            <div className="text-xs text-flame">{post.date}</div>
            <h2 className="font-display mt-2 text-xl font-bold leading-tight">{post.title}</h2>
            <p className="mt-2 text-sm text-white/60">{post.excerpt}</p>
            <span className="mt-auto pt-4 font-display text-sm font-bold text-flame">Read →</span>
          </Link>
        ))}
      </div>
    </MarketShell>
  );
}
