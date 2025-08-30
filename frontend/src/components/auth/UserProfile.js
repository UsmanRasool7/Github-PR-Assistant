// src/components/auth/UserProfile.js
'use client';

import { useAuth } from '../../contexts/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        {user.avatar_url && (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {user.full_name || user.username}
          </span>
          <span className="text-xs text-gray-500">@{user.username}</span>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign out
      </button>
    </div>
  );
}
