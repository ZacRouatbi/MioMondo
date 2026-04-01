import { Product, Category } from "@/types/product";

export const fetchBestsellers = async (): Promise<Product[]> => {
  const res = await fetch("/api/products?featured=true&per_page=8&orderby=popularity");
  if (!res.ok) throw new Error("Failed to fetch bestsellers");
  return res.json();
};

export const fetchNewArrivals = async (): Promise<Product[]> => {
  const res = await fetch("/api/products?orderby=date&order=desc&per_page=8");
  if (!res.ok) throw new Error("Failed to fetch new arrivals");
  return res.json();
};


export const addToCart = async (productId: number, quantity = 1): Promise<void> => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
};
