'use client';

import { useState } from 'react';

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: 'dashboard', count: null },
    { id: 'reviews', name: 'Reviews', icon: 'reviews', count: 12 },
    { id: 'repositories', name: 'Repositories', icon: 'repositories', count: 5 },
    { id: 'analytics', name: 'Analytics', icon: 'analytics', count: null },
    { id: 'settings', name: 'Settings', icon: 'settings', count: null },
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      reviews: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      repositories: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      analytics: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      settings: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };
    return icons[iconName] || icons.dashboard;
  };

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900/95 backdrop-blur-xl shadow-2xl border-r border-zinc-800/50">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-zinc-800/50">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            PR AI
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveItem(item.id)}
                className={`group w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/10'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={`transition-colors duration-200 ${activeItem === item.id ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                    {getIcon(item.icon)}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.count && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full transition-colors duration-200 ${
                    activeItem === item.id 
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                      : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-zinc-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800/50">
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-indigo-500/25">
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Review
          </button>
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span>System Status</span>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                <div className="absolute inset-0 h-2 w-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-emerald-400 font-medium">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
