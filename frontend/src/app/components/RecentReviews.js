'use client';

export default function RecentReviews() {
  const mockReviews = [
    {
      id: 1,
      prNumber: '#142',
      title: 'Add user authentication middleware',
      repository: 'backend-api',
      author: 'john-doe',
      status: 'completed',
      aiScore: 92,
      timeAgo: '2 hours ago',
      issuesFound: 2,
      suggestions: 5
    },
    {
      id: 2,
      prNumber: '#139',
      title: 'Update React components for accessibility',
      repository: 'frontend-app',
      author: 'jane-smith',
      status: 'processing',
      aiScore: null,
      timeAgo: '5 minutes ago',
      issuesFound: null,
      suggestions: null
    },
    {
      id: 3,
      prNumber: '#138',
      title: 'Fix database connection pooling',
      repository: 'backend-api',
      author: 'mike-wilson',
      status: 'completed',
      aiScore: 88,
      timeAgo: '1 day ago',
      issuesFound: 1,
      suggestions: 3
    },
    {
      id: 4,
      prNumber: '#136',
      title: 'Implement caching strategy',
      repository: 'backend-api',
      author: 'sarah-jones',
      status: 'completed',
      aiScore: 95,
      timeAgo: '2 days ago',
      issuesFound: 0,
      suggestions: 2
    },
    {
      id: 5,
      prNumber: '#134',
      title: 'Add unit tests for payment module',
      repository: 'payment-service',
      author: 'alex-brown',
      status: 'failed',
      aiScore: null,
      timeAgo: '3 days ago',
      issuesFound: null,
      suggestions: null
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        text: 'text-emerald-400',
        label: 'Completed',
        icon: (
          <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      processing: {
        bg: 'bg-amber-500/10 border-amber-500/20',
        text: 'text-amber-400',
        label: 'Processing',
        icon: (
          <svg className="h-3 w-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      },
      failed: {
        bg: 'bg-red-500/10 border-red-500/20',
        text: 'text-red-400',
        label: 'Failed',
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
        {config.label}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 75) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-500';
    if (score >= 75) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-zinc-100">Recent Reviews</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1 rounded-lg hover:bg-indigo-500/10 transition-all duration-200">
            View all
            <svg className="h-4 w-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y divide-zinc-800/50">
        {mockReviews.map((review) => (
          <div key={review.id} className="px-6 py-5 hover:bg-zinc-800/30 transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-sm font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                    {review.prNumber}
                  </span>
                  <span className="text-sm text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded-lg">
                    {review.repository}
                  </span>
                  {getStatusBadge(review.status)}
                </div>
                <h4 className="text-sm font-medium text-zinc-200 mb-2 group-hover:text-zinc-100 transition-colors duration-200">
                  {review.title}
                </h4>
                <div className="flex items-center space-x-4 text-xs text-zinc-500">
                  <span className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {review.author}
                  </span>
                  <span className="flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {review.timeAgo}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 ml-6">
                {review.aiScore !== null && (
                  <div className="text-center">
                    <div className={`text-lg font-bold bg-gradient-to-r ${getScoreGradient(review.aiScore)} bg-clip-text text-transparent`}>
                      {review.aiScore}
                    </div>
                    <div className="text-xs text-zinc-500">AI Score</div>
                  </div>
                )}

                {review.issuesFound !== null && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-zinc-200">
                      {review.issuesFound}
                    </div>
                    <div className="text-xs text-zinc-500">Issues</div>
                  </div>
                )}

                {review.suggestions !== null && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-zinc-200">
                      {review.suggestions}
                    </div>
                    <div className="text-xs text-zinc-500">Tips</div>
                  </div>
                )}

                <button className="p-2 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800/50 transition-all duration-200 group-hover:text-zinc-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
