import axios from "axios";
import { tokenStore } from "@/lib/auth";

const BASE_URL =
  (import.meta).env
    ?.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// ---- Request interceptor: attach access token ----
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Response interceptor: refresh-token flow with queue ----
let isRefreshing = false;
let waiters = [];

const flushWaiters = (token) => {
  waiters.forEach((cb) => cb(token));
  waiters = [];
};

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    if (!original || status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // Don't try to refresh on the auth endpoints themselves
    const url = original.url || "";
    if (url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiters.push((token) => {
          if (!token) return reject(error);
          original.headers = original.headers || {};
          (original.headers).Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken: refresh,
      });
      const newAccess = data?.data?.accessToken;
      const newRefresh = data?.data?.refreshToken;
      if (!newAccess) throw new Error("No access token in refresh response");
      tokenStore.setAccess(newAccess);
      if (newRefresh) localStorage.setItem("ss_refresh_token", newRefresh);
      flushWaiters(newAccess);
      original.headers = original.headers || {};
      (original.headers).Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      flushWaiters(null);
      tokenStore.clear();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

// Convenience typed helper
export async function apiGet(url, params) {
  const { data } = await api.get(url, { params });
  return data?.data ?? data;
}

export async function apiPost(url, body) {
  const { data } = await api.post(url, body);
  return data?.data ?? data;
}

export async function apiPut(url, body) {
  const { data } = await api.put(url, body);
  return data?.data ?? data;
}

export async function apiDelete(url) {
  const { data } = await api.delete(url);
  return data?.data ?? data;
}
