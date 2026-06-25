import type { Metadata } from "next";
import { Inter, Saira_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-saira",
});

export const metadata: Metadata = {
  title: "GRIP 93 — One Tyre. Every Journey.",
  description:
    "GRIP 93 premium performance tyres. Strong grip, long life, all-weather safety — one tyre, every journey.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${saira.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-white font-sans antialiased" suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
