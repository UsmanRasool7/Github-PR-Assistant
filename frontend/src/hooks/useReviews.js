// src/hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/apiClient";

/**
 * useReviews({ repoId, status, page, autoRefresh, intervalMs })
 */
export function useReviews({ repoId, status, page = 1, autoRefresh = false, intervalMs = 10000 } = {}) {
  return useQuery({
    queryKey: ["reviews", { repoId, status, page }],
    queryFn: async () => {
      const limit = 20;
      const skip = (page - 1) * limit; // Convert page to skip offset
      const params = { skip, limit };
      if (repoId) params.repo_id = repoId;
      if (status) params.status = status;
      const res = await api.get("/api/reviews/", { params });
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 30, // 30s
    gcTime: 1000 * 60 * 5, // 5min (renamed from cacheTime in v5)
    refetchInterval: autoRefresh ? intervalMs : false, // automatic polling
    refetchOnWindowFocus: !autoRefresh, // if autoRefresh enabled we don't need window focus refetch
  });
}

/**
 * useUpdateReview() with optimistic updates across cached "reviews" queries
 */
export function useUpdateReview() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }) => {
      const res = await api.put(`/api/reviews/${id}`, patch);
      return res.data;
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: ["reviews"] });
      // Snapshot all current reviews queries
      const previous = qc.getQueriesData({ queryKey: ["reviews"] }); // [[key, data], ...]
      // Optimistically update each cache item list
      previous.forEach(([key, data]) => {
        if (!data || !data.items) return;
        const newData = {
          ...data,
          items: data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        };
        qc.setQueryData(key, newData);
      });
      return { previous };
    },
    onError: (err, variables, context) => {
      // rollback all snapshots
      if (context?.previous) {
        context.previous.forEach(([key, data]) => {
          qc.setQueryData(key, data);
        });
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}
