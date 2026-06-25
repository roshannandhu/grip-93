import type { Section } from "@/components/market/Prose";

export type Page = { title: string; lead?: string; sections: Section[] };

export const PAGES: Record<string, Page> = {
  "how-we-inspect": {
    title: "How we inspect",
    lead: "Every tyre passes a 12-point check before it is listed and graded.",
    sections: [
      { h: "The 12-point check", ul: [
        "Tread depth measured at inner, centre and outer ribs",
        "Sidewall checked for bulges, cuts and cracks",
        "Bead and seating integrity",
        "Inner liner inspection",
        "Puncture / repair history (only safe, plug-repaired tyres listed)",
        "Uneven / feathered wear assessment",
        "Manufacture date (DOT) — nothing older than our age limit",
        "Run-flat status verification",
        "Air-hold (24-hour pressure) test",
        "Valve condition",
        "Wheel balance test",
        "Final visual QC + photographs of the actual tyre",
      ] },
      { h: "Grading", p: [
        "Based on tread and overall condition we assign a grade: A (90%+ tread, like new), B (70–90%), C (50–70%) and D (30–50%). Every listing shows the grade, exact tread in mm, and manufacture week/year so you decide with full information.",
      ] },
    ],
  },
  "buying-guide": {
    title: "Used tyre buying guide",
    lead: "A safe used tyre is about tread, age and condition — here's how to read them.",
    sections: [
      { h: "Reading the size", p: ["A size like 195/65 R15 means 195 mm wide, sidewall height 65% of width, on a 15-inch rim. Match your vehicle's recommended size (on the door jamb sticker)."] },
      { h: "Tread depth", p: ["New tyres start around 8 mm. The legal minimum in India is 1.6 mm. We recommend buying with at least 4 mm left for meaningful life and wet grip."] },
      { h: "Age (DOT)", p: ["Tyres harden with age. The DOT code shows the manufacture week/year. Prefer tyres under ~5 years old regardless of tread."] },
      { h: "When is a used tyre safe?", ul: ["Even wear across the tread", "No sidewall bulges or deep cracks", "At most one professional plug repair", "Holds air over 24 hours", "Within a sensible age limit"] },
    ],
  },
  warranty: {
    title: "Warranty & returns",
    lead: "Buy used with confidence — backed by a clear policy.",
    sections: [
      { h: "7-day condition warranty", p: ["If a delivered tyre's condition materially differs from its listed grade/report, return it within 7 days for a replacement or full refund."] },
      { h: "What's covered", ul: ["Condition not matching the report", "Wrong size shipped", "Manufacturing defect missed in inspection"] },
      { h: "What's not covered", ul: ["Damage after fitment", "Normal wear from use", "Improper fitment or under-inflation"] },
      { h: "How to claim", p: ["Contact support with your order ID and photos. We arrange reverse pickup at no cost for valid claims."] },
    ],
  },
  about: {
    title: "About GRIP 93",
    lead: "India's trusted marketplace for certified second-hand tyres.",
    sections: [
      { p: ["GRIP 93 makes buying and selling used tyres simple, safe and transparent. Every tyre is inspected, graded and photographed, with tread depth and manufacture date shown up front — then delivered to your pincode with a GST invoice."] },
      { h: "Why used?", p: ["A quality used tyre with plenty of tread can cost up to 60% less than new, while keeping you safe. We make sure you only see tyres worth buying."] },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    sections: [
      { h: "Are used tyres safe?", p: ["Yes — when inspected. We list only tyres that pass our 12-point check, and show you the grade, tread and age so you can judge."] },
      { h: "Do you deliver across India?", p: ["Yes, pan-India to your pincode. Delivery is free on orders above ₹5,000."] },
      { h: "Do I get a GST invoice?", p: ["Yes. Add your GSTIN at checkout to receive a GST invoice."] },
      { h: "What payment methods are supported?", p: ["UPI, cards/netbanking, and Cash on Delivery (this demo does not process real payments)."] },
      { h: "Can I sell my old tyres?", p: ["Absolutely — use the Sell page for an instant quote and free doorstep pickup."] },
    ],
  },
  shipping: {
    title: "Shipping & delivery",
    sections: [
      { h: "Coverage", p: ["We deliver to serviceable pincodes across India."] },
      { h: "Timelines", p: ["Typically 3–7 business days depending on your location. You'll see an estimate on the product page and tracking after you order."] },
      { h: "Charges", p: ["Flat ₹299 delivery; free on orders above ₹5,000."] },
    ],
  },
  returns: {
    title: "Refund & return policy",
    sections: [
      { h: "7-day returns", p: ["Return within 7 days if the tyre's condition differs from its listed report."] },
      { h: "Refund timeline", p: ["Approved refunds are processed to the original payment method within 5–7 business days."] },
      { h: "Non-returnable", p: ["Tyres that have been fitted/used, or damaged after delivery, are not eligible."] },
    ],
  },
  terms: {
    title: "Terms & conditions",
    sections: [
      { p: ["By using GRIP 93 you agree to these terms. This is a demonstration marketplace; listings, prices and checkout are for illustration and do not constitute a real sale."] },
      { h: "Listings", p: ["We strive for accurate condition reports. Grades are assessments, not guarantees of future performance."] },
      { h: "Liability", p: ["Tyres must be fitted and balanced by a professional. GRIP 93 is not liable for damage arising from improper fitment or use."] },
    ],
  },
  privacy: {
    title: "Privacy policy",
    sections: [
      { p: ["We respect your privacy. In this demo, cart, wishlist and orders are stored locally in your browser and are not sent to any server."] },
      { h: "Information we'd collect (production)", ul: ["Contact and delivery details to fulfil orders", "Payment details via a secure gateway", "Usage data to improve the service"] },
      { h: "Your choices", p: ["You can clear local data anytime from your browser settings."] },
    ],
  },
};

export type BlogPost = { slug: string; title: string; excerpt: string; date: string; body: Section[] };

export const POSTS: BlogPost[] = [
  {
    slug: "are-used-tyres-safe",
    title: "Are used tyres safe? What to actually check",
    excerpt: "Used doesn't mean unsafe. Here's the short checklist that matters.",
    date: "Jun 2026",
    body: [
      { p: ["A well-chosen used tyre can be just as safe as new — the trick is knowing what to look at."] },
      { h: "The three numbers", ul: ["Tread depth (aim for 4 mm+)", "Age via DOT (under ~5 years)", "Even wear with no sidewall damage"] },
      { p: ["Every GRIP 93 listing shows all three plus a 12-point inspection, so you're never guessing."] },
    ],
  },
  {
    slug: "how-to-check-tread-depth",
    title: "How to check tread depth (the ₹1 coin trick)",
    excerpt: "No gauge? A coin and 30 seconds tell you most of what you need.",
    date: "Jun 2026",
    body: [
      { p: ["Tread channels water away. Too little and wet grip falls off a cliff."] },
      { h: "Quick checks", ul: ["Tread wear indicators (small raised bars) flush with tread = replace", "Coin test across multiple grooves", "Compare inner vs outer — uneven wear hints at alignment issues"] },
    ],
  },
  {
    slug: "tyre-care-tips",
    title: "5 tyre care tips to double your tread life",
    excerpt: "Pressure, rotation and alignment do most of the work.",
    date: "Jun 2026",
    body: [
      { ul: ["Check pressure monthly (cold)", "Rotate every 8–10,000 km", "Get wheel alignment & balancing on schedule", "Avoid harsh braking and kerb hits", "Store spares away from sunlight"] },
    ],
  },
];

export function getPost(slug: string) {
  return POSTS.find((p) => p.slug === slug);
}
