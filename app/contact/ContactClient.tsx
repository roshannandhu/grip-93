"use client";

import { useState } from "react";

const inp = "w-full rounded-lg border border-white/15 bg-ink-700/60 px-3 py-2.5 text-sm outline-none focus:border-flame";

export default function ContactClient() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold md:text-5xl">Contact us</h1>
      <p className="mt-2 text-white/55">We&apos;re here to help with orders, listings and returns.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_280px]">
        {sent ? (
          <div className="rounded-2xl glass p-8 text-center">
            <div className="text-4xl">📨</div>
            <h2 className="font-display mt-3 text-2xl font-bold">Thanks — message sent!</h2>
            <p className="mt-2 text-white/55">Our team will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form className="space-y-3 rounded-2xl glass p-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <input className={inp} placeholder="Your name" required />
            <input className={inp} placeholder="Email or phone" required />
            <input className={inp} placeholder="Order ID (optional)" />
            <textarea className={`${inp} min-h-[120px]`} placeholder="How can we help?" required />
            <button className="w-full rounded-lg bg-flame px-6 py-3 font-display font-bold uppercase tracking-wide text-[#120a04] shadow-flame transition hover:bg-flame-light">Send message →</button>
          </form>
        )}

        <aside className="space-y-4 rounded-2xl glass p-6 text-sm text-white/65">
          <div>
            <div className="font-display font-bold text-white">Support</div>
            <p className="mt-1">support@grip93.example</p>
            <p>+91 90000 00093</p>
          </div>
          <div>
            <div className="font-display font-bold text-white">Hours</div>
            <p className="mt-1">Mon–Sat, 9am–7pm IST</p>
          </div>
          <div>
            <div className="font-display font-bold text-white">Office</div>
            <p className="mt-1">Andheri East, Mumbai, MH</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
