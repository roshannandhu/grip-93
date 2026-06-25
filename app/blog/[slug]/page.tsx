import Link from "next/link";
import { notFound } from "next/navigation";
import MarketShell from "@/components/market/MarketShell";
import Prose from "@/components/market/Prose";
import { POSTS, getPost } from "@/lib/content";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  return { title: p ? `${p.title} — GRIP 93` : "Blog — GRIP 93" };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return (
    <MarketShell>
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="text-sm text-white/45 hover:text-flame">← All posts</Link>
        <div className="mt-3 text-xs text-flame">{post.date}</div>
      </div>
      <Prose title={post.title} sections={post.body} />
    </MarketShell>
  );
}
