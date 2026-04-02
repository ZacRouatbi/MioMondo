export async function fetchBestsellers() {
  const response = await fetch("/api/bestsellers");
  if (!response.ok) throw new Error("Failed to fetch bestsellers");
  return response.json();
}