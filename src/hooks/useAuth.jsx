import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, apiPost } from "@/lib/api";
import { tokenStore } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(tokenStore.getUser());
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setUser(null);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      const u = data?.data ?? data;
      tokenStore.setUser(u);
      setUser(u);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refreshMe();
      setLoading(false);
    })();
  }, [refreshMe]);

  const login = useCallback(async (email, password) => {
    const res = await apiPost("/auth/login", { email, password });
    tokenStore.set(res.accessToken, res.refreshToken, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await apiPost("/auth/register", { name, email, password });
    tokenStore.set(res.accessToken, res.refreshToken, res.user);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStore.getRefresh();
    try {
      await api.post("/auth/logout", { refreshToken });
    } catch {
      /* ignore network errors on logout */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshMe,
  }), [user, loading, login, register, logout, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
