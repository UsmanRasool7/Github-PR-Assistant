'use client';

import { useState } from 'react';
import StatsCards from './StatsCards';
import RecentReviews from './RecentReviews';
import SystemHealth from './SystemHealth';
import RepoStatus from './RepoStatus';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Welcome back! Here's what's happening with your PR reviews.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-3 bg-zinc-800/50 backdrop-blur-xl border border-zinc-700/50 rounded-xl text-zinc-300 hover:bg-zinc-700/50 hover:text-zinc-100 transition-all duration-200 font-medium">
            <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Data
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-indigo-500/25 font-medium">
            <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reviews - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <RecentReviews />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <SystemHealth />
          <RepoStatus />
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
        <h2 className="text-xl font-bold text-zinc-100 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-indigo-500/30 transition-all duration-200 group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-indigo-500/25">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">New Review</h3>
                <p className="text-zinc-400 text-sm">Start analyzing code</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-cyan-500/30 transition-all duration-200 group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-cyan-500/25">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">Repositories</h3>
                <p className="text-zinc-400 text-sm">Manage tracked repos</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-emerald-500/30 transition-all duration-200 group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-emerald-500/25">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">Analytics</h3>
                <p className="text-zinc-400 text-sm">View insights</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800/50 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-violet-500/30 transition-all duration-200 group cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-violet-500/25">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-zinc-200 font-semibold">Settings</h3>
                <p className="text-zinc-400 text-sm">Configure AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
