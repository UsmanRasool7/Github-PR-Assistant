'use client';

export default function SystemHealth() {
  const systemStatus = {
    overall: 'healthy',
    services: [
      { name: 'GitHub API', status: 'healthy', responseTime: '120ms' },
      { name: 'AI Engine (Ollama)', status: 'healthy', responseTime: '2.3s' },
      { name: 'Vector DB (ChromaDB)', status: 'healthy', responseTime: '45ms' },
      { name: 'Webhook Server', status: 'healthy', responseTime: '85ms' }
    ],
    lastCheck: '2 minutes ago'
  };

  const getStatusIndicator = (status) => {
    const statusConfig = {
      healthy: {
        color: 'bg-emerald-500',
        ringColor: 'ring-emerald-500/30',
        text: 'Healthy',
        textColor: 'text-emerald-400'
      },
      warning: {
        color: 'bg-amber-500',
        ringColor: 'ring-amber-500/30',
        text: 'Warning',
        textColor: 'text-amber-400'
      },
      error: {
        color: 'bg-red-500',
        ringColor: 'ring-red-500/30',
        text: 'Error',
        textColor: 'text-red-400'
      }
    };

    const config = statusConfig[status] || statusConfig.healthy;
    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`h-2 w-2 rounded-full ${config.color}`}></div>
          <div className={`absolute inset-0 h-2 w-2 rounded-full ${config.color} animate-ping opacity-75`}></div>
        </div>
        <span className={`text-sm font-medium ${config.textColor}`}>{config.text}</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-100">System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 h-2 w-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-xs text-emerald-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="p-6 space-y-4">
        {systemStatus.services.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className={`h-2 w-2 rounded-full ${
                  service.status === 'healthy' ? 'bg-emerald-500' : 
                  service.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <div className={`absolute inset-0 h-2 w-2 rounded-full ${
                  service.status === 'healthy' ? 'bg-emerald-500' : 
                  service.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                } animate-ping opacity-75`}></div>
              </div>
              <span className="text-sm font-medium text-zinc-200">{service.name}</span>
            </div>
            <div className="text-xs text-zinc-400 bg-zinc-700/50 px-2 py-1 rounded-lg font-mono">
              {service.responseTime}
            </div>
          </div>
        ))}

        {/* Overall Stats */}
        <div className="pt-4 mt-4 border-t border-zinc-800/50">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-xs text-zinc-500 mt-1">Uptime</div>
            </div>
            <div className="text-center bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                1.2s
              </div>
              <div className="text-xs text-zinc-500 mt-1">Avg Response</div>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 text-center pt-3 flex items-center justify-center space-x-2">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Last checked {systemStatus.lastCheck}</span>
        </div>
      </div>
    </div>
  );
}
