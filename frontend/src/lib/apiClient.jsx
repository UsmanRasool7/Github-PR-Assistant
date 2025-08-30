// src/lib/apiClient.js
import axios from "axios";
import authService from "../services/authService";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((cfg) => {
  if (typeof window !== 'undefined') {
    // Ensure auth service is initialized
    authService.init();
    
    const token = authService.getToken();
    if (token) {
      cfg.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  
  return cfg;
});

// Handle auth errors and logout if needed
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response) {
      // If we get a 401, clear the auth state
      if (error.response.status === 401 && typeof window !== 'undefined') {
        authService.logout();
        window.location.reload();
      }
      
      // Create a more detailed error object that preserves the original error structure
      const customError = new Error(error.response.data?.detail || error.message || 'Request failed');
      customError.status = error.response.status;
      customError.data = error.response.data;
      customError.response = error.response;
      customError.original = error;
      
      return Promise.reject(customError);
    }
    
    const networkError = new Error(error.message || 'Network error');
    networkError.status = 0;
    networkError.original = error;
    
    return Promise.reject(networkError);
  }
);

export default api;
