import type { Metadata } from "next";
import { Inter, Saira_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { MarketProvider } from "@/lib/store";
import CartDrawer from "@/components/market/CartDrawer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: "GRIP 93 — Certified Used Tyres, Delivered Across India",
  description:
    "Buy inspected second-hand tyres online in India. 12-point checked, graded condition, tread depth & manufacture year shown. Search by size or vehicle. ₹ prices, GST invoice, pan-India delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${saira.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-white font-sans antialiased" suppressHydrationWarning>
        <MarketProvider>
          <SmoothScroll>{children}</SmoothScroll>
          <CartDrawer />
        </MarketProvider>
      </body>
    </html>
  );
}
