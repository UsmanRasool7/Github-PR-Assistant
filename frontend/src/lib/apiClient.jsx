// src/lib/apiClient.js
import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token if you add auth later
api.interceptors.request.use((cfg) => {
  // const token = localStorage.getItem("token");
  // if (token) cfg.headers["Authorization"] = `Bearer ${token}`;
  return cfg;
});

// unwrap errors into a consistent shape
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        data: error.response.data,
        message: error.response.data?.detail || error.message,
      });
    }
    return Promise.reject({ message: error.message, status: 0 });
  }
);

export default api;
