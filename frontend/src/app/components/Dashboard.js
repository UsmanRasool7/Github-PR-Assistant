'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRepositories, useUserReviews, useUserStats, useSyncRepositories } from '../../hooks/useUserData';
import LoginButton from '../../components/auth/LoginButton';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { data: repositories, isLoading: reposLoading } = useUserRepositories();
  const { data: reviews, isLoading: reviewsLoading } = useUserReviews();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const syncRepositories = useSyncRepositories();

  const handleSyncRepositories = async () => {
    try {
      await syncRepositories.mutateAsync();
      // Could add a toast notification here
    } catch (error) {
      console.error('Sync failed:', error);
      // Could add error toast here
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-zinc-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3">Welcome to CodeReview AI</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
            Sign in with your GitHub account to start analyzing your pull requests and get AI-powered code reviews.
          </p>
          <LoginButton />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="h-8 w-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-zinc-200">AI Reviews</h3>
              <p className="text-xs text-zinc-400 mt-1">Automated code analysis</p>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="h-8 w-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-zinc-200">Insights</h3>
              <p className="text-xs text-zinc-400 mt-1">Code quality metrics</p>
            </div>
            <div className="bg-zinc-800/30 rounded-lg p-4">
              <div className="h-8 w-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-zinc-200">Real-time</h3>
              <p className="text-xs text-zinc-400 mt-1">Instant feedback</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Welcome back, {user?.full_name || user?.username}! Here are your recent activities.
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleSyncRepositories}
            disabled={syncRepositories.isPending}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-indigo-500/25 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncRepositories.isPending ? (
              <>
                <svg className="h-4 w-4 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync GitHub Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-400">Your Repositories</p>
              <p className="text-2xl font-bold text-zinc-100">
                {statsLoading ? '...' : (stats?.total_repositories || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/25">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-400">Reviews Completed</p>
              <p className="text-2xl font-bold text-zinc-100">
                {statsLoading ? '...' : (stats?.total_reviews || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-zinc-400">Active Pull Requests</p>
              <p className="text-2xl font-bold text-zinc-100">
                {statsLoading ? '...' : (stats?.active_pull_requests || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reviews */}
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Recent Reviews</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-zinc-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading reviews...</p>
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.slice(0, 5).map((review) => (
                <div key={review.id} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-zinc-200 font-medium">{review.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      review.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2">{review.repository?.name || 'Unknown repo'}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-zinc-700/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-zinc-400">No reviews yet</p>
                <p className="text-sm text-zinc-500 mt-1">Create your first review to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Your Repositories */}
        <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Your Repositories</h2>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              Manage
            </button>
          </div>
          <div className="space-y-4">
            {reposLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-zinc-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-zinc-400">Loading repositories...</p>
              </div>
            ) : repositories && repositories.length > 0 ? (
              repositories.slice(0, 5).map((repo) => (
                <div key={repo.id} className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-zinc-200 font-medium">{repo.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      repo.is_private ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {repo.is_private ? 'Private' : 'Public'}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-sm text-zinc-400 mb-2">{repo.description}</p>
                  )}
                  <p className="text-xs text-zinc-500">
                    {repo.default_branch && `${repo.default_branch} • `}
                    Last updated {new Date(repo.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="h-12 w-12 bg-zinc-700/50 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="h-6 w-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-zinc-400">No repositories synced</p>
                <p className="text-sm text-zinc-500 mt-1">Click "Sync GitHub Data" to import your repositories</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
        <h2 className="text-xl font-bold text-zinc-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 border border-zinc-700/50 hover:border-indigo-500/30 transition-all duration-200 group cursor-pointer text-left">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-indigo-500/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium">New Review</h3>
                <p className="text-zinc-400 text-sm">Analyze a pull request</p>
              </div>
            </div>
          </button>

          <button className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 border border-zinc-700/50 hover:border-cyan-500/30 transition-all duration-200 group cursor-pointer text-left">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-cyan-500/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium">Sync Repos</h3>
                <p className="text-zinc-400 text-sm">Import from GitHub</p>
              </div>
            </div>
          </button>

          <button className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-4 border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-200 group cursor-pointer text-left">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-emerald-500/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-medium">View Analytics</h3>
                <p className="text-zinc-400 text-sm">Code quality insights</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
