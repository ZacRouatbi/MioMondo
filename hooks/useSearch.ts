export async function searchProducts(query: string) {
  if (!query) return [];
  const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}