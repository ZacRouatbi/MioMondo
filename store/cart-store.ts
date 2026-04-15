"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: number;
  variationId?: number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  category?: string;
  variant?: string;
};

type CartState = {
  items: CartItem[];
  promoCode: string | null;
  discountPercent: number;
  shippingRate: number;
  freeShippingThreshold: number;

  // Update settings from API
  setShippingSettings: (rate: number, threshold: number) => void;

  addItem: (item: CartItem) => void;
  removeItem: (id: number, variationId?: number) => void;
  updateQty: (id: number, qty: number, variationId?: number) => void;
  updateItemsMetadata: (serverProducts: any[]) => void;

  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
  clear: () => void;

  itemCount: () => number;
  subtotal: () => number;
  discount: () => number;
  shipping: () => number;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountPercent: 0,
      shippingRate: 7, 
      freeShippingThreshold: 300,

      setShippingSettings: (rate, threshold) => 
        set({ shippingRate: rate, freeShippingThreshold: threshold }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === item.id &&
              (i.variationId ?? null) === (item.variationId ?? null)
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        }),

      removeItem: (id, variationId) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.id === id &&
                (i.variationId ?? null) === (variationId ?? null)
              )
          ),
        })),

      updateQty: (id, qty, variationId) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) =>
                    !(
                      i.id === id &&
                      (i.variationId ?? null) === (variationId ?? null)
                    )
                )
              : state.items.map((i) =>
                  i.id === id &&
                  (i.variationId ?? null) === (variationId ?? null)
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),

      updateItemsMetadata: (serverProducts) =>
        set((state) => ({
          items: state.items.map((localItem) => {
            const fresh = serverProducts.find((p) => p.id === localItem.id);
            if (!fresh) return localItem;

            return {
              ...localItem,
              price: Number(fresh.price),
              name: fresh.name,
              image: fresh.image,
            };
          }),
        })),

      applyPromo: (code, discount) =>
        set({
          promoCode: code,
          discountPercent: discount,
        }),

      removePromo: () =>
        set({
          promoCode: null,
          discountPercent: 0,
        }),

      clear: () =>
        set({
          items: [],
          promoCode: null,
          discountPercent: 0,
        }),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discount: () => {
        const subtotal = get().subtotal();
        const promo = get().promoCode;
        const percent = get().discountPercent;
        return promo ? Math.round((subtotal * percent) / 100) : 0;
      },

      shipping: () => {
        const currentSubtotal = get().subtotal() - get().discount();
        const threshold = get().freeShippingThreshold;
        const rate = get().shippingRate;

        // If cart is empty, shipping is 0
        if (get().items.length === 0) return 0;
        
        return currentSubtotal >= threshold ? 0 : rate;
      },

      total: () => {
        const s = get().subtotal();
        const d = get().discount();
        const ship = get().shipping();
        return s - d + ship;
      },
    }),
    {
      name: "mm_cart", 

    }
  )
);

export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useCart.persist.onFinishHydration(() => setHydrated(true));
    if (useCart.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  return hydrated;
}