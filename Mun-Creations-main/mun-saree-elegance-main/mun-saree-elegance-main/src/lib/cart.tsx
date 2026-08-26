import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number };

type Ctx = {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  count: number;
  subtotalUsd: number;
  open: boolean;
  setOpen: (o: boolean) => void;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("mun_cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mun_cart_items", JSON.stringify(items));
      } catch {
        // Ignore storage errors
      }
    }
  }, [items]);

  const value = useMemo<Ctx>(() => {
    const add = (p: Product) => {
      setItems((prev) => {
        const found = prev.find((i) => i.product.id === p.id);
        if (found) return prev.map((i) => (i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i));
        return [...prev, { product: p, qty: 1 }];
      });
      setOpen(true);
    };
    const remove = (id: string) => setItems((prev) => prev.filter((i) => i.product.id !== id));
    const setQty = (id: string, qty: number) =>
      setItems((prev) =>
        prev
          .map((i) => (i.product.id === id ? { ...i, qty: Math.max(0, qty) } : i))
          .filter((i) => i.qty > 0),
      );
    const clearCart = () => {
      setItems([]);
      try {
        localStorage.removeItem("mun_cart_items");
      } catch {}
    };
    return {
      items,
      add,
      remove,
      setQty,
      clearCart,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotalUsd: items.reduce((s, i) => s + i.qty * i.product.priceUsd, 0),
      open,
      setOpen,
    };
  }, [items, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
}
