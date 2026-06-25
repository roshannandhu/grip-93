"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, Order } from "./types";

type State = {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  orders: Order[];
};

type Ctx = State & {
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  inCompare: (id: string) => boolean;
  addOrder: (o: Order) => void;
  cartCount: number;
  ready: boolean;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const KEY = "grip93-market";
const MarketContext = createContext<Ctx | null>(null);

const empty: State = { cart: [], wishlist: [], compare: [], orders: [] };

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const first = useRef(true);

  // hydrate from localStorage once (after mount → no SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  // persist
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api = useMemo<Ctx>(() => {
    const up = (patch: Partial<State> | ((s: State) => State)) =>
      setState((s) => (typeof patch === "function" ? patch(s) : { ...s, ...patch }));

    return {
      ...state,
      ready,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      cartCount: state.cart.reduce((n, i) => n + i.qty, 0),
      addToCart: (id, qty = 1) =>
        up((s) => {
          const ex = s.cart.find((i) => i.id === id);
          const cart = ex
            ? s.cart.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
            : [...s.cart, { id, qty }];
          return { ...s, cart };
        }),
      setQty: (id, qty) =>
        up((s) => ({ ...s, cart: s.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)) })),
      removeFromCart: (id) => up((s) => ({ ...s, cart: s.cart.filter((i) => i.id !== id) })),
      clearCart: () => up((s) => ({ ...s, cart: [] })),
      toggleWishlist: (id) =>
        up((s) => ({
          ...s,
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),
      inWishlist: (id) => state.wishlist.includes(id),
      toggleCompare: (id) =>
        up((s) => {
          if (s.compare.includes(id)) return { ...s, compare: s.compare.filter((x) => x !== id) };
          if (s.compare.length >= 3) return s; // cap at 3
          return { ...s, compare: [...s.compare, id] };
        }),
      inCompare: (id) => state.compare.includes(id),
      addOrder: (o) => up((s) => ({ ...s, orders: [o, ...s.orders], cart: [] })),
    };
  }, [state, ready, cartOpen]);

  return <MarketContext.Provider value={api}>{children}</MarketContext.Provider>;
}

export function useMarket(): Ctx {
  const c = useContext(MarketContext);
  if (!c) throw new Error("useMarket must be used within MarketProvider");
  return c;
}
