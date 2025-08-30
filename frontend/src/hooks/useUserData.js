// src/hooks/useUserData.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/apiClient";
import { useAuth } from "../contexts/AuthContext";

/**
 * Get user's repositories
 */
export function useUserRepositories() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["user-repositories"],
    queryFn: async () => {
      const res = await api.get("/api/auth/repositories");
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

/**
 * Get user's reviews
 */
export function useUserReviews() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["user-reviews"],
    queryFn: async () => {
      const res = await api.get("/api/auth/reviews");
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get user's dashboard stats
 */
export function useUserStats() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: async () => {
      const res = await api.get("/api/auth/dashboard");
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Sync user's repositories from GitHub
 */
export function useSyncRepositories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      console.log("Starting repository sync...");
      const res = await api.post("/api/auth/sync-repos");
      console.log("Sync response:", res.data);
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Sync successful:", data);
      // Invalidate and refetch all user data
      queryClient.invalidateQueries({ queryKey: ["user-repositories"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
    },
    onError: (error) => {
      console.error("Failed to sync repositories:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
        response: error.response?.data
      });
    },
  });
}
