
export const addToCart = async (productId: number, quantity = 1): Promise<void> => {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
};