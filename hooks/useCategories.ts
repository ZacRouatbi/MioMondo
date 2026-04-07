"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Category, CategoryNode } from "@/types/product";


export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/categories?per_page=100&orderby=count&order=desc", {
    next: { revalidate: 3600 } 
  });
  
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};


export function buildCategoryTree(flat: Category[]): CategoryNode[] {
  if (!flat || !Array.isArray(flat)) return [];

  const map = new Map<number, CategoryNode>();
  

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


export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

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


export function collectDescendantIds(node: CategoryNode, depth = 0): number[] {
  // Emergency brake: No WooCommerce tree should be 15 levels deep.
  if (!node || depth > 15) return [];

  const children = node.children || [];
  const childIds = children.flatMap((child) => collectDescendantIds(child, depth + 1));
  
  return [node.id, ...childIds];
}


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