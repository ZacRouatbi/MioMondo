import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // ─── LOGIN ───
  const login = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.reload(); 
    },
  });

  // ─── SIGNUP ───
  const signup = useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      return data;
    },
    onSuccess: () => {
      window.location.reload();
    },
  });

  // ─── LOGOUT ───
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Logout failed");
      return res.json();
    },
    onSuccess: () => {
      // Clear cache and redirect
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      
      router.push("/");
      router.refresh(); 
      // Note: If Server Components don't update, swap router.refresh() for window.location.reload()
    },
  });

  return { 
    login, 
    signup, 
    logout: logoutMutation.mutate,
    isLoading: login.isPending || signup.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: login.error || signup.error
  };
};