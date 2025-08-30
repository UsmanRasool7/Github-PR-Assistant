// src/store/useAppStore.js
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  // Selected repository for filtering reviews
  selectedRepoId: null,
  setSelectedRepoId: (repoId) => set({ selectedRepoId: repoId }),
  
  // Global app state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Notification system
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), ...notification }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
}));
