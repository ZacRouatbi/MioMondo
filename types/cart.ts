import type { Product } from "@/types/product";

export type CartItem = {
  id: number;
  variationId?: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  onSale: boolean;
  quantity: number;
  image: string | null;
  variant?: string;
  sku?: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode: string | null;
  shipping: number;
  total: number;
};

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number; variationId?: number } }
  | { type: "UPDATE_QTY"; payload: { id: number; variationId?: number; quantity: number } }
  | { type: "APPLY_PROMO"; payload: { code: string; discountPercent: number } }
  | { type: "REMOVE_PROMO" }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };
