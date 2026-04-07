"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Category, CategoryNode } from "@/types/product";

/**
 * 1. Fetcher: Standard WooCommerce Category Fetch
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories?per_page=100&orderby=count&order=desc", {
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

/**
 * 2. Tree Builder: Converts flat array to hierarchical structure.
 * This handles your future subcategories automatically.
 */
export function buildCategoryTree(flat: Category[]): CategoryNode[] {
  if (!flat || !Array.isArray(flat)) return [];

  const map = new Map<number, CategoryNode>();
  
  // Create nodes for everything first
  flat.forEach((c) => {
    map.set(c.id, { ...c, children: [] });
  });

  const roots: CategoryNode[] = [];
  
  map.forEach((node) => {
    if (node.parent === 0) {
      roots.push(node);
    } else {
      const parent = map.get(node.parent);
      if (parent) {
        parent.children.push(node);
      } else {
        // Orphan handling: If parent isn't in this batch, treat as root
        roots.push(node);
      }
    }
  });

  return roots;
}

/**
 * 3. Primary Hook: Fetches the raw list
 */
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * 4. Tree Hook: The "Bunker" version.
 * useMemo ensures the tree is only rebuilt when data actually changes.
 * This is what prevents the "Back Button" freeze.
 */
export function useCategoryTree() {
  const query = useCategories();
  
  const tree = useMemo(() => {
    if (!query.data) return [];
    try {
      return buildCategoryTree(query.data);
    } catch (err) {
      console.error("Error building category tree:", err);
      return [];
    }
  }, [query.data]); // Critical dependency

  return {
    ...query,
    tree,
  };
}

/**
 * 5. Recursive Helper: Collects ID + all nested children IDs.
 * Added a "depth" safety to prevent infinite recursion if data is circular.
 */
export function collectDescendantIds(node: CategoryNode, depth = 0): number[] {
  // Emergency brake: No WooCommerce tree should be 15 levels deep.
  if (!node || depth > 15) return [];

  const children = node.children || [];
  const childIds = children.flatMap((child) => collectDescendantIds(child, depth + 1));
  
  return [node.id, ...childIds];
}

/**
 * 6. Utility: Find a specific node anywhere in the tree.
 */
export function findNodeById(
  nodes: CategoryNode[] | undefined,
  id: number
): CategoryNode | undefined {
  if (!nodes) return undefined;

  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}