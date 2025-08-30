// src/app/components/ReviewList.js
"use client";

import React from "react";
import { useReviews, useUpdateReview } from "../../hooks/useReviews";
import { useAppStore } from "../../store/useAppStore";

export default function ReviewList() {
  const selectedRepoId = useAppStore((s) => s.selectedRepoId);
  // autoRefresh true will poll every 10s (default)
  const { data, isLoading, isError, refetch, isFetching } = useReviews({
    repoId: selectedRepoId,
    autoRefresh: true,
    intervalMs: 10000,
  });

  const updateMutation = useUpdateReview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-zinc-400">Loading reviews...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-4">Error loading reviews</div>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const items = data?.items || [];

  const onToggleStatus = (review) => {
    const nextStatus = review.status === "pending" ? "processing" : "done";
    updateMutation.mutate({ id: review.id, patch: { status: nextStatus } });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      processing: { color: "bg-blue-500", text: "Processing" },
      done: { color: "bg-green-500", text: "Done" },
      failed: { color: "bg-red-500", text: "Failed" }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100">Reviews</h2>
          <div className="flex items-center space-x-2">
            {isFetching && (
              <div className="flex items-center text-blue-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                Updating...
              </div>
            )}
            <button 
              onClick={() => refetch()}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-zinc-400 mb-2">No reviews found</div>
            <div className="text-sm text-zinc-500">
              {selectedRepoId ? "No reviews for selected repository" : "Select a repository to view reviews"}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((review) => (
              <div 
                key={review.id} 
                className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-zinc-100 mb-1">
                      PR #{review.pr_number}: {review.title || "No title"}
                    </h3>
                    <div className="text-sm text-zinc-400">
                      by {review.author || "Unknown"} • {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(review.status)}
                  </div>
                </div>

                {review.summary && (
                  <div className="mb-3">
                    <div className="text-sm text-zinc-300 bg-zinc-900/50 rounded p-3 border border-zinc-700/30">
                      {review.summary.slice(0, 200)}
                      {review.summary.length > 200 && "..."}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-zinc-500">
                    Updated: {new Date(review.updated_at).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => onToggleStatus(review)}
                    disabled={updateMutation.isLoading}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded text-sm transition-colors"
                  >
                    {updateMutation.isLoading ? "Updating..." : "Toggle Status"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
