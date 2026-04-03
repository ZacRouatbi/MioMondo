"use client";

import { useReducer, useEffect, useCallback, useMemo } from "react";
import type { Cart, CartItem, CartAction } from "@/types/cart";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mm_cart";
const FREE_SHIPPING_THRESHOLD = 300;
const SHIPPING_RATE = 15;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSameItem(a: CartItem, b: Pick<CartItem, "id" | "variationId">) {
  return a.id === b.id && (a.variationId ?? null) === (b.variationId ?? null);
}

function computeTotals(
  items: CartItem[],
  discountPercent: number,
  promoCode: string | null
): Pick<Cart, "subtotal" | "discount" | "shipping" | "total"> {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = promoCode ? Math.round(subtotal * discountPercent) / 100 : 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const total = subtotal - discount + shipping;
  return { subtotal, discount, shipping, total };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type State = {
  items: CartItem[];
  promoCode: string | null;
  discountPercent: number;
};

function reducer(state: State, action: CartAction): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.payload };

    case "ADD_ITEM": {
      const existing = state.items.find((i) => isSameItem(i, action.payload));
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            isSameItem(i, action.payload)
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => !isSameItem(i, action.payload)),
      };

    case "UPDATE_QTY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => !isSameItem(i, action.payload)),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          isSameItem(i, action.payload)
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    }

    case "APPLY_PROMO":
      return {
        ...state,
        promoCode: action.payload.code,
        discountPercent: action.payload.discountPercent,
      };

    case "REMOVE_PROMO":
      return { ...state, promoCode: null, discountPercent: 0 };

    case "CLEAR_CART":
      return { ...state, items: [], promoCode: null, discountPercent: 0 };

    default:
      return state;
  }
}

const initialState: State = {
  items: [],
  promoCode: null,
  discountPercent: 0,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // corrupted storage — start fresh
    }
  }, []);

  // Persist items to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage quota exceeded or unavailable
    }
  }, [state.items]);

  // Derived totals
  const totals = useMemo(
    () => computeTotals(state.items, state.discountPercent, state.promoCode),
    [state.items, state.discountPercent, state.promoCode]
  );

  const cart: Cart = {
    items: state.items,
    promoCode: state.promoCode,
    discount: totals.discount,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
  };

  // ── Actions ────────────────────────────────────────────────────────────────

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((id: number, variationId?: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, variationId } });
  }, []);

  const updateQty = useCallback(
    (id: number, quantity: number, variationId?: number) => {
      dispatch({ type: "UPDATE_QTY", payload: { id, variationId, quantity } });
    },
    []
  );

  const applyPromo = useCallback(
    async (code: string): Promise<{ success: boolean; message: string }> => {
      try {
        const res = await fetch("/api/cart/promo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();
        if (data.valid) {
          dispatch({
            type: "APPLY_PROMO",
            payload: { code, discountPercent: data.discountPercent },
          });
          return { success: true, message: `${data.discountPercent}% discount applied.` };
        }
        return { success: false, message: data.message ?? "Invalid promo code." };
      } catch {
        return { success: false, message: "Could not validate code. Try again." };
      }
    },
    []
  );

  const removePromo = useCallback(() => {
    dispatch({ type: "REMOVE_PROMO" });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    cart,
    itemCount,
    addItem,
    removeItem,
    updateQty,
    applyPromo,
    removePromo,
    clearCart,
  };
}