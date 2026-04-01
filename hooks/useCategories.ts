import { Category } from "@/types/product";

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories?per_page=20&orderby=count&order=desc", {
    // This tells Next.js to cache the response for 3600 seconds (1 hour)
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};