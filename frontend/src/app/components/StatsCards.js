'use client';

export default function StatsCards() {
  const stats = [
    {
      name: 'Total Reviews',
      value: '156',
      change: '+12%',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-indigo-500',
      shadowColor: 'shadow-blue-500/25'
    },
    {
      name: 'Active PRs',
      value: '23',
      change: '+3',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/25'
    },
    {
      name: 'Avg Review Time',
      value: '2.3m',
      change: '-15%',
      changeType: 'decrease',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-violet-500',
      shadowColor: 'shadow-purple-500/25'
    },
    {
      name: 'Success Rate',
      value: '98.2%',
      change: '+0.5%',
      changeType: 'increase',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: 'from-cyan-500 to-blue-500',
      shadowColor: 'shadow-cyan-500/25'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={stat.name} className="relative bg-zinc-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-zinc-800/50 p-6 hover:border-zinc-700/50 transition-all duration-200 group overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
              <p className="text-3xl font-bold text-zinc-100 mt-2">{stat.value}</p>
            </div>
            <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-xl shadow-lg ${stat.shadowColor} group-hover:scale-110 transition-transform duration-200`}>
              <span className="text-white">
                {stat.icon}
              </span>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`inline-flex items-center text-sm font-medium px-2 py-1 rounded-lg ${
              stat.changeType === 'increase' 
                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' 
                : 'text-red-400 bg-red-500/10 border border-red-500/20'
            }`}>
              {stat.changeType === 'increase' ? (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              ) : (
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              {stat.change}
            </span>
            <span className="text-sm text-zinc-500 ml-2">from last week</span>
          </div>

          {/* Subtle background gradient effect */}
          <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-5 rounded-xl pointer-events-none`}></div>
        </div>
      ))}
    </div>
  );
}
