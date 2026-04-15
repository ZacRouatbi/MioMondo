"use client";

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
  _hydrated: boolean;
  _setHydrated: () => void;

  addItem: (item: CartItem) => void;
  removeItem: (id: number, variationId?: number) => void;
  updateQty: (id: number, qty: number, variationId?: number) => void;
  updateItemsMetadata: (serverProducts: any[]) => void; // ✅ Added to Type

  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;
  clear: () => void;

  itemCount: () => number;
  subtotal: () => number;
  discount: () => number;
  shipping: () => number;
  total: () => number;
};

const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_RATE = 15;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discountPercent: 0,
      _hydrated: false,
      _setHydrated: () => set({ _hydrated: true }),

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
              !(i.id === id && (i.variationId ?? null) === (variationId ?? null))
          ),
        })),

      updateQty: (id, qty, variationId) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) =>
                    !(i.id === id && (i.variationId ?? null) === (variationId ?? null))
                )
              : state.items.map((i) =>
                  i.id === id && (i.variationId ?? null) === (variationId ?? null)
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),

      // ✅ Correctly placed inside the state object
      updateItemsMetadata: (serverProducts: any[]) => {
        set((state) => ({
          items: state.items.map((localItem) => {
            const freshData = serverProducts.find((p) => p.id === localItem.id);
            if (freshData) {
              return {
                ...localItem,
                price: Number(freshData.price), // Ensure it stays a number
                name: freshData.name,
                image: freshData.image,
              };
            }
            return localItem;
          }),
        }));
      },

      applyPromo: (code, discount) =>
        set(() => ({
          promoCode: code,
          discountPercent: discount,
        })),

      removePromo: () =>
        set(() => ({
          promoCode: null,
          discountPercent: 0,
        })),

      clear: () => set({ items: [], promoCode: null, discountPercent: 0 }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      discount: () => {
        const subtotal = get().subtotal();
        const promo = get().promoCode;
        const percent = get().discountPercent;
        return promo ? Math.round((subtotal * percent) / 100) : 0;
      },

      shipping: () => {
        const after = get().subtotal() - get().discount();
        return after >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
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
      onRehydrateStorage: () => (state, error) => {
        if (state) state._setHydrated();
      },
    }
  )
);

export function useCartHydrated() {
  return useCart((s) => s._hydrated);
}