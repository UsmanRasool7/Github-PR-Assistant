'use client';

import { useState } from 'react';

export default function ReviewsList() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockReviews = [
    {
      id: 1,
      prNumber: '#142',
      title: 'Add user authentication middleware for API security',
      repository: 'backend-api',
      author: 'john-doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'completed',
      aiScore: 92,
      timeAgo: '2 hours ago',
      issuesFound: 2,
      suggestions: 5,
      filesChanged: 8,
      linesAdded: 156,
      linesRemoved: 42,
      aiSummary: 'Strong implementation of JWT authentication with proper error handling. Consider adding rate limiting and input validation improvements.',
      labels: ['security', 'authentication', 'backend']
    },
    {
      id: 2,
      prNumber: '#139',
      title: 'Update React components for better accessibility support',
      repository: 'frontend-app',
      author: 'jane-smith',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'processing',
      aiScore: null,
      timeAgo: '5 minutes ago',
      issuesFound: null,
      suggestions: null,
      filesChanged: 12,
      linesAdded: 89,
      linesRemoved: 23,
      aiSummary: null,
      labels: ['accessibility', 'frontend', 'react']
    },
    {
      id: 3,
      prNumber: '#138',
      title: 'Fix database connection pooling issues in production',
      repository: 'backend-api',
      author: 'mike-wilson',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'completed',
      aiScore: 88,
      timeAgo: '1 day ago',
      issuesFound: 1,
      suggestions: 3,
      filesChanged: 4,
      linesAdded: 67,
      linesRemoved: 89,
      aiSummary: 'Good fix for connection pool management. The timeout configuration looks appropriate, but consider adding monitoring for pool exhaustion.',
      labels: ['database', 'performance', 'bugfix']
    },
    {
      id: 4,
      prNumber: '#136',
      title: 'Implement Redis caching strategy for improved performance',
      repository: 'backend-api',
      author: 'sarah-jones',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'completed',
      aiScore: 95,
      timeAgo: '2 days ago',
      issuesFound: 0,
      suggestions: 2,
      filesChanged: 6,
      linesAdded: 234,
      linesRemoved: 12,
      aiSummary: 'Excellent caching implementation with proper invalidation strategies. Well-structured code with good error handling and fallback mechanisms.',
      labels: ['caching', 'performance', 'redis']
    },
    {
      id: 5,
      prNumber: '#134',
      title: 'Add comprehensive unit tests for payment processing module',
      repository: 'payment-service',
      author: 'alex-brown',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      status: 'failed',
      aiScore: null,
      timeAgo: '3 days ago',
      issuesFound: null,
      suggestions: null,
      filesChanged: 15,
      linesAdded: 456,
      linesRemoved: 78,
      aiSummary: null,
      labels: ['testing', 'payments', 'unit-tests']
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        text: 'text-emerald-400',
        icon: (
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      processing: {
        bg: 'bg-amber-500/10 border-amber-500/20',
        text: 'text-amber-400',
        icon: (
          <svg className="h-3 w-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      },
      failed: {
        bg: 'bg-red-500/10 border-red-500/20',
        text: 'text-red-400',
        icon: (
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    };

    const config = statusConfig[status] || statusConfig.completed;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-500';
    if (score >= 75) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const filteredReviews = mockReviews.filter(review => {
    const matchesFilter = filter === 'all' || review.status === filter;
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.repository.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Code Reviews
        </h1>
        <p className="text-zinc-400 mt-2 text-lg">AI-powered code reviews for all your pull requests</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {['all', 'completed', 'processing', 'failed'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  filter === filterOption
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 border border-zinc-700/50 rounded-lg bg-zinc-800/50 backdrop-blur-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-8">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-200 group">
            {/* Header */}
            <div className="px-6 py-5 border-b border-zinc-800/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      className="h-12 w-12 rounded-xl shadow-lg"
                      src={review.avatar}
                      alt={review.author}
                    />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-zinc-900"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
                        {review.prNumber}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-sm text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-lg">
                        {review.repository}
                      </span>
                      {getStatusBadge(review.status)}
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-2 group-hover:text-white transition-colors duration-200">
                      {review.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-zinc-500">
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {review.author}
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {review.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Score */}
                {review.aiScore !== null && (
                  <div className={`px-4 py-3 rounded-xl border ${getScoreColor(review.aiScore)}`}>
                    <div className="text-center">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${getScoreGradient(review.aiScore)} bg-clip-text text-transparent`}>
                        {review.aiScore}
                      </div>
                      <div className="text-xs font-medium text-zinc-400">AI Score</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {/* Labels */}
              <div className="flex flex-wrap gap-2 mb-4">
                {review.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 hover:border-zinc-600/50 transition-colors duration-200"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* AI Summary */}
              {review.aiSummary && (
                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
                  <div className="flex items-start space-x-3">
                    <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-300 mb-2">AI Summary</h4>
                      <p className="text-sm text-zinc-300 leading-relaxed">{review.aiSummary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                  <div className="text-lg font-bold text-zinc-200">{review.filesChanged}</div>
                  <div className="text-xs text-zinc-500">Files</div>
                </div>
                <div className="text-center bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                  <div className="text-lg font-bold text-emerald-400">+{review.linesAdded}</div>
                  <div className="text-xs text-zinc-500">Added</div>
                </div>
                <div className="text-center bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                  <div className="text-lg font-bold text-red-400">-{review.linesRemoved}</div>
                  <div className="text-xs text-zinc-500">Removed</div>
                </div>
                {review.issuesFound !== null && (
                  <div className="text-center bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    <div className="text-lg font-bold text-amber-400">{review.issuesFound}</div>
                    <div className="text-xs text-zinc-500">Issues</div>
                  </div>
                )}
                {review.suggestions !== null && (
                  <div className="text-center bg-zinc-800/30 rounded-lg p-3 border border-zinc-700/30">
                    <div className="text-lg font-bold text-blue-400">{review.suggestions}</div>
                    <div className="text-xs text-zinc-500">Tips</div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-zinc-800/30 border-t border-zinc-800/50 flex justify-between items-center rounded-b-xl">
              <div className="flex space-x-4">
                <button className="text-sm text-zinc-400 hover:text-zinc-200 font-medium transition-colors duration-200">
                  <svg className="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on GitHub
                </button>
                <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200">
                  <svg className="h-4 w-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-700/50 transition-all duration-200">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReviews.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl p-8 border border-zinc-800/50 max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">No reviews found</h3>
            <p className="text-sm text-zinc-500">Try adjusting your search terms or filters.</p>
          </div>
        </div>
      )}
    </div>
  );
}
