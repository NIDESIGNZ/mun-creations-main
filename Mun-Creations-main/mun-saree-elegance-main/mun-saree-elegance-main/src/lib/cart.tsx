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

  // Authoritative Revalidation: Sync live prices, stock levels & detect deleted/archived items
  useEffect(() => {
    if (items.length === 0 || typeof window === "undefined") return;

    let isMounted = true;
    const revalidateCartItems = async () => {
      try {
        let changed = false;
        const updatedList: CartItem[] = [];

        for (const item of items) {
          try {
            const res = await fetch(`/api/products/${encodeURIComponent(item.product.id)}`);
            if (res.status === 404 || !res.ok) {
              // Product was deleted, archived, or unpublished
              changed = true;
              updatedList.push({
                ...item,
                product: {
                  ...item.product,
                  availability: "Out of Stock",
                  stockQuantity: 0,
                  inStock: false,
                  active: false,
                  published: false,
                },
              });
            } else {
              const liveProduct: Product = await res.json();
              const priceMismatch = liveProduct.priceUsd !== item.product.priceUsd;
              const stockMismatch = liveProduct.stockQuantity !== item.product.stockQuantity;
              const statusMismatch =
                liveProduct.active !== item.product.active ||
                liveProduct.published !== item.product.published;
              const nameMismatch = liveProduct.name !== item.product.name;
              const imageMismatch = liveProduct.image !== item.product.image;

              if (priceMismatch || stockMismatch || statusMismatch || nameMismatch || imageMismatch) {
                changed = true;
                const effectiveStock = liveProduct.stockQuantity ?? (liveProduct as any).stock ?? 1;
                updatedList.push({
                  product: liveProduct,
                  qty: Math.min(item.qty, Math.max(1, effectiveStock)),
                });
              } else {
                updatedList.push(item);
              }
            }
          } catch {
            updatedList.push(item);
          }
        }

        if (changed && isMounted) {
          setItems(updatedList);
        }
      } catch {
        // Network error; retain current items
      }
    };

    revalidateCartItems();

    return () => {
      isMounted = false;
    };
  }, [open]);

  const value = useMemo<Ctx>(() => {
    const add = (p: Product) => {
      const stock = p.stockQuantity ?? (p as any).stock ?? 10;
      setItems((prev) => {
        const found = prev.find((i) => i.product.id === p.id);
        if (found) {
          const nextQty = Math.min(found.qty + 1, stock);
          return prev.map((i) => (i.product.id === p.id ? { ...i, qty: nextQty } : i));
        }
        return [...prev, { product: p, qty: 1 }];
      });
      setOpen(true);
    };
    const remove = (id: string) => {
      setItems((prev) => {
        const updated = prev.filter((i) => i.product.id !== id);
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("mun_cart_items", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });
    };
    const setQty = (id: string, qty: number) =>
      setItems((prev) => {
        const updated = prev
          .map((i) => {
            if (i.product.id === id) {
              const stock = i.product.stockQuantity ?? (i.product as any).stock ?? 10;
              const clamped = Math.min(Math.max(1, qty), stock);
              return { ...i, qty: clamped };
            }
            return i;
          })
          .filter((i) => i.qty > 0);
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("mun_cart_items", JSON.stringify(updated));
          }
        } catch {}
        return updated;
      });
    const clearCart = () => {
      setItems([]);
      try {
        localStorage.removeItem("mun_cart_items");
      } catch {
        // Ignore localStorage error
      }
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
