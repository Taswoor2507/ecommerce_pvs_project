import axios from "axios";
import authStore from "../store/authStore";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Separate client for refresh
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Main API client
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ─────────────────────────────────────────────────────────────
// Request Interceptor (Attach Token Safely)
// ─────────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = authStore.getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ─────────────────────────────────────────────────────────────
// Refresh Queue System (SAFE)
// ─────────────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue = [];
const MAX_QUEUE_SIZE = 50;
function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });

  failedQueue = [];
}

// ─────────────────────────────────────────────────────────────
// Cross-tab Token Sync (ADVANCED)
// ─────────────────────────────────────────────────────────────
const channel = new BroadcastChannel("auth_channel");

channel.onmessage = (event) => {
  if (event.data?.type === "TOKEN_UPDATE") {
    authStore.setToken(event.data.token);
  }

  if (event.data?.type === "LOGOUT") {
    authStore.clearToken();
    window.location.href = "/login";
  }
};

function broadcastToken(token) {
  channel.postMessage({ type: "TOKEN_UPDATE", token });
}

function broadcastLogout() {
  channel.postMessage({ type: "LOGOUT" });
}

// ─────────────────────────────────────────────────────────────
// Response Interceptor (Robust)
// ─────────────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    //  No response → network/server down
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(error);
    }

    //  Not 401 → reject
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop
    originalRequest._retryCount = originalRequest._retryCount || 0;
    if (originalRequest._retryCount >= 2) {
      return Promise.reject(error);
    }

    //  If refresh endpoint itself fails
    if (originalRequest.url?.includes("/auth/refresh-token")) {
      authStore.clearToken();
      broadcastLogout();
      return Promise.reject(error);
    }

    // ─────────────────────────────────────────
    // Queue if refresh in progress
    // ─────────────────────────────────────────
    if (isRefreshing) {
      if (failedQueue.length >= MAX_QUEUE_SIZE) {
        return Promise.reject(new Error("Too many pending requests"));
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // ─────────────────────────────────────────
    // Start Refresh Flow
    // ─────────────────────────────────────────
    originalRequest._retryCount += 1;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post("/auth//refresh-token");

      const newToken = data?.accessToken;

      //  Safety check
      if (!newToken) {
        throw new Error("Invalid refresh response: no accessToken");
      }

      // Store token
      authStore.setToken(newToken);
      broadcastToken(newToken);

      // Resolve queued requests
      processQueue(null, newToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      console.error("Refresh failed:", refreshError);

      processQueue(refreshError, null);

      authStore.clearToken();
      broadcastLogout();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
