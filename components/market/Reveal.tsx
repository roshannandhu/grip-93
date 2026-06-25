"use client";

import { useEffect, useRef, useState } from "react";

// Lightweight entrance animation: fade + translate-up when scrolled into view.
// Reusable client island; respects prefers-reduced-motion (shows instantly).
export default function Reveal({
  children,
  delay = 0,
  className = "",
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity .7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform .7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
