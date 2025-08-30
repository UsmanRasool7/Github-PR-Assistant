'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginButton from '../../components/auth/LoginButton';
import UserProfile from '../../components/auth/UserProfile';

export default function Header() {
  const [notifications] = useState(3);
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <header className="bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-800/50 shadow-2xl sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/25">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                CodeReview AI
              </h1>
              <span className="ml-2 px-2 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/20">
                PRO
              </span>
            </div>
          </div>

          {/* Search Bar - only show when authenticated */}
          {isAuthenticated && (
            <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
              <div className="max-w-lg w-full lg:max-w-xs">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-700/50 rounded-lg leading-5 bg-zinc-800/50 backdrop-blur-sm placeholder-zinc-400 focus:outline-none focus:placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 sm:text-sm transition-all duration-200"
                    placeholder="Search PRs, repos, or reviews..."
                    type="search"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right side - Authentication and User Info */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-4 w-4 border-2 border-zinc-400 border-t-transparent rounded-full"></div>
                <span className="text-sm text-zinc-400">Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-zinc-400 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded-lg transition-all duration-200 hover:bg-zinc-800/50">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5V9a3 3 0 00-6 0v3l-5 5h5a3 3 0 106 0z" />
                  </svg>
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 block h-5 w-5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-xs text-white items-center justify-center font-bold">
                        {notifications}
                      </span>
                    </span>
                  )}
                </button>

                {/* User Profile */}
                <UserProfile />

                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
                    <div className="absolute inset-0 h-2 w-2 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm text-zinc-400 hidden sm:block">Online</span>
                </div>
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
