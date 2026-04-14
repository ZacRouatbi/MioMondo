import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { WishlistItem } from "@/types/product";

export function useWishlist() {
  const queryClient = useQueryClient();

  // 1. Fetch Wishlist
  const { data: wishlistItems = [], isLoading } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await fetch("/api/account/wishlist");
      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((item: any) => {
        return {
          ...item,
          product_id: item.product_id ?? item.id, // fallback safety
          slug: item.slug ?? "", // fallback safety
        };
      });
      return normalized as WishlistItem[];
    },
  });
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch("/api/account/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) throw new Error("You must be logged in to save to wishlist");
      return res.json();
    },

    onMutate: async (productId) => {

      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist =
        queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      // Optimistic Update
      queryClient.setQueryData(["wishlist"], (old: WishlistItem[] = []) => [
        ...old,
        {
          id: Date.now(),
          product_id: productId,
          name: "Chargement...",
          price: "",
          image: "",
        },
      ]);

      return { previousWishlist };
    },

    onError: (err, productId, context) => {
      alert(err);
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // 3. Remove from Wishlist
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(
        `/api/account/wishlist?productId=${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Could not remove from wishlist");

      return res.json();
    },

    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });

      const previousWishlist =
        queryClient.getQueryData<WishlistItem[]>(["wishlist"]);
      queryClient.setQueryData(["wishlist"], (old: WishlistItem[] = []) =>
        old.filter((item) => item.product_id !== productId)
      );

      return { previousWishlist };
    },

    onError: (err, productId, context) => {
      console.error("❌ REMOVE ERROR:", err);
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const isInWishlist = (productId: number) => {
    return wishlistItems.some((item) => item.product_id === productId);
  };

  return {
    wishlistItems,
    isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isInWishlist,
  };
}