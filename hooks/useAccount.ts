"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CustomerInfo, Order, WishlistItem } from "@/types/user";
// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// useAccountInfo - Fetch and update customer information
// ─────────────────────────────────────────────────────────────────────────────

export const useAccountInfo = (customerId?: string | number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["account", "info", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Customer ID is required");
      const res = await fetch(`/api/account/informations?id=${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch customer info");
      return res.json() as Promise<CustomerInfo>;
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<CustomerInfo>) => {
      const res = await fetch(`/api/account/informations`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customerId, ...data }),
      });
      if (!res.ok) throw new Error("Failed to update customer info");
      return res.json() as Promise<CustomerInfo>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["account", "info", customerId], data);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// useAccountOrders - Fetch customer orders
// ─────────────────────────────────────────────────────────────────────────────

export const useAccountOrders = (customerId?: string | number) => {
  const query = useQuery({
    queryKey: ["account", "orders", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Customer ID is required");
      const res = await fetch(`/api/account/orders?customer=${customerId}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<Order[]>;
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 10,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// useAccountWishlist - Fetch and manage wishlist items
// ─────────────────────────────────────────────────────────────────────────────

export const useAccountWishlist = (customerId?: string | number) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["account", "wishlist", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Customer ID is required");
      const res = await fetch(`/api/account/wishlist?customer=${customerId}`);
      if (!res.ok) return [];
      return res.json() as Promise<WishlistItem[]>;
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 5,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(`/api/account/wishlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: customerId, product_id: productId }),
      });
      if (!res.ok) throw new Error("Failed to remove from wishlist");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "wishlist", customerId] });
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    removeItem: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
    removeError: removeMutation.error,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// useChangePassword - Change customer password
// ─────────────────────────────────────────────────────────────────────────────

export const useChangePassword = (customerId?: string | number) => {
  const mutation = useMutation({
    mutationFn: async (passwords: { current: string; next: string }) => {
      if (!customerId) throw new Error("Customer ID is required");
      const res = await fetch(`/api/account/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customerId,
          current: passwords.current,
          next: passwords.next,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to change password");
      }
      return res.json();
    },
  });

  return {
    changePassword: mutation.mutate,
    isChanging: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// useAccount - Convenience hook combining all account operations
// ─────────────────────────────────────────────────────────────────────────────

export const useAccount = (customerId?: string | number) => {
  const info = useAccountInfo(customerId);
  const orders = useAccountOrders(customerId);
  const wishlist = useAccountWishlist(customerId);
  const changePassword = useChangePassword(customerId);

  return {
    info,
    orders,
    wishlist,
    changePassword,
    isLoading: info.isLoading || orders.isLoading || wishlist.isLoading,
  };
};
