import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

// Standard wrapper for marketplace pages: shared nav + footer + dark backdrop.
export default function MarketShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-10" style={{ background: "radial-gradient(ellipse 90% 70% at 50% -10%, #1a120b 0%, #0b0907 45%, #070708 80%)" }} />
      <div className="px-4 md:px-6">
        <SiteNav />
      </div>
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-8 md:px-6">{children}</main>
      <SiteFooter />
    </>
  );
}
