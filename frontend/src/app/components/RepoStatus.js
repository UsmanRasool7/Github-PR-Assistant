'use client';

export default function RepoStatus() {
  const repositories = [
    {
      name: 'backend-api',
      status: 'active',
      prsTotal: 45,
      prsActive: 8,
      lastActivity: '2 hours ago',
      webhookStatus: 'connected'
    },
    {
      name: 'frontend-app',
      status: 'active',
      prsTotal: 32,
      prsActive: 5,
      lastActivity: '5 minutes ago',
      webhookStatus: 'connected'
    },
    {
      name: 'mobile-app',
      status: 'inactive',
      prsTotal: 18,
      prsActive: 0,
      lastActivity: '3 days ago',
      webhookStatus: 'disconnected'
    },
    {
      name: 'payment-service',
      status: 'active',
      prsTotal: 29,
      prsActive: 3,
      lastActivity: '1 day ago',
      webhookStatus: 'connected'
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500'
      },
      inactive: {
        bg: 'bg-zinc-500/10 border-zinc-500/20',
        text: 'text-zinc-400',
        dot: 'bg-zinc-500'
      }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`h-2 w-2 rounded-full ${config.dot}`}></div>
          {status === 'active' && (
            <div className={`absolute inset-0 h-2 w-2 rounded-full ${config.dot} animate-ping opacity-75`}></div>
          )}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-lg border ${config.bg} ${config.text}`}>
          {status}
        </span>
      </div>
    );
  };

  const getWebhookStatus = (status) => {
    return status === 'connected' ? (
      <div className="flex items-center space-x-1 text-emerald-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-xs font-medium">Connected</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-red-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
        <span className="text-xs font-medium">Disconnected</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">Repository Status</h3>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium px-3 py-1 rounded-lg hover:bg-indigo-500/10 transition-all duration-200">
            Manage
          </button>
        </div>
      </div>

      {/* Repositories List */}
      <div className="divide-y divide-zinc-800/50">
        {repositories.map((repo) => (
          <div key={repo.name} className="px-6 py-4 hover:bg-zinc-800/30 transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="text-sm font-semibold text-zinc-200 truncate">
                    {repo.name}
                  </h4>
                  {getStatusBadge(repo.status)}
                </div>
                <div className="text-xs text-zinc-500 space-y-1">
                  <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{repo.prsTotal} PRs total • {repo.prsActive} active</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last activity {repo.lastActivity}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex flex-col items-end space-y-2">
                <div className="flex items-center" title={`Webhook ${repo.webhookStatus}`}>
                  {getWebhookStatus(repo.webhookStatus)}
                </div>
                <button className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800/50 transition-all duration-200">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Repository Button */}
      <div className="px-6 py-4 border-t border-zinc-800/50">
        <button className="w-full flex items-center justify-center px-4 py-3 border border-zinc-700/50 rounded-xl text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-zinc-100 hover:border-zinc-600/50 transition-all duration-200 group">
          <svg className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Repository
        </button>
      </div>
    </div>
  );
}
