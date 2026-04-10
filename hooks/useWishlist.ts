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
      // Since our custom PHP returns a clean array, we just return it
      return (Array.isArray(data) ? data : []) as WishlistItem[];
    },
  });

  // 2. Add to Wishlist
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch("/api/account/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Could not add to wishlist");
      return res.json();
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      // Optimistic Update
      queryClient.setQueryData(["wishlist"], (old: WishlistItem[] = []) => [
        ...old,
        { 
          id: Date.now(), // Temporary ID
          product_id: productId,
          name: "Chargement...", 
          price: "",
          image: "" 
        }, 
      ]);

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  // 3. Remove from Wishlist
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`/api/account/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Could not remove from wishlist");
      return res.json();
    },
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist"] });
      const previousWishlist = queryClient.getQueryData<WishlistItem[]>(["wishlist"]);

      // Optimistic Update (UI removes it immediately)
      queryClient.setQueryData(["wishlist"], (old: WishlistItem[] = []) =>
        old.filter((item) => item.product_id !== productId)
      );

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      queryClient.setQueryData(["wishlist"], context?.previousWishlist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const isInWishlist = (productId: number) => 
    wishlistItems.some((item) => item.product_id === productId);

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