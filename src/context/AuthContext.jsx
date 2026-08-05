import React, { createContext, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      if (getToken()) {
        try {
          const { user: me } = await api.get("/auth/me");
          setUser(me);
        } catch {
          setToken(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = async (phone, password, rememberMe = false) => {
    try {
      const { token, user: apiUser } = await api.post("/auth/login", { phone, password });
      setToken(token, rememberMe);
      setUser(apiUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const adminLogin = async (phone, password, rememberMe = false) => {
    try {
      const { token, user: apiUser } = await api.post("/auth/admin-login", { phone, password });
      setToken(token, rememberMe);
      setUser(apiUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const register = async ({ name, phone, password, mandalId }) => {
    try {
      const { token, user: apiUser } = await api.post("/auth/register", { name, phone, password, mandalId });
      setToken(token, true);
      setUser(apiUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const sendOtp = async (phone, purpose) => {
    try {
      const data = await api.post("/auth/otp/send", { phone, purpose });
      return { ok: true, ...data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const verifyOtp = async (phone, code, purpose, rememberMe = true) => {
    try {
      const data = await api.post("/auth/otp/verify", { phone, code, purpose });
      if (purpose === "login" && data.token) {
        setToken(data.token, rememberMe);
        setUser(data.user);
      }
      return { ok: true, ...data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const forgotPassword = async (phone) => {
    try {
      const { message } = await api.post("/auth/forgot-password", { phone });
      return { ok: true, message };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const isAdmin = user && ["Mandal Admin", "Administrator"].includes(user.role);

  const listUsers = async () => {
    const { users } = await api.get("/users");
    return users;
  };

  const updateUserRole = async (id, role) => {
    const { user: updated } = await api.patch(`/users/${id}`, { role });
    if (user?.id === id) setUser(updated);
    return updated;
  };

  const deleteUser = async (id) => {
    await api.del(`/users/${id}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        ready,
        isAdmin,
        login,
        adminLogin,
        register,
        sendOtp,
        verifyOtp,
        forgotPassword,
        logout,
        listUsers,
        updateUserRole,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
