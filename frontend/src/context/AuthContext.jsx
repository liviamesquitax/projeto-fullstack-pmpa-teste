import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { decodeToken, isTokenValid } from "../utils/auth";

const AuthContext = createContext(null);

const getInitialUser = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  const payload = decodeToken(token);

  if (!payload || !isTokenValid(payload)) {
    return null;
  }

  return {
    id: payload.id,
    role: payload.role,
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
  };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    setUser(null);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const payload = decodeToken(token);

    if (!payload || !isTokenValid(payload)) {
      logout();
      setIsLoading(false);
      return;
    }

    let name = localStorage.getItem("userName") || "";
    let email = localStorage.getItem("userEmail") || "";

    if (["admin", "super"].includes(payload.role)) {
      try {
        const response = await api.get("/usuarios");
        const foundUser = response.data.find((item) => item._id === payload.id);

        if (foundUser) {
          name = foundUser.nome || name;
          email = foundUser.email || email;
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
        }
      } catch (error) {
        // Keep cached values when profile lookup fails.
      }
    }

    setUser({
      id: payload.id,
      role: payload.role,
      name,
      email,
    });
    setIsLoading(false);
  };

  const login = (token, fallbackEmail) => {
    localStorage.setItem("token", token);

    if (fallbackEmail) {
      localStorage.setItem("userEmail", fallbackEmail);
    }

    const payload = decodeToken(token);

    if (!payload || !isTokenValid(payload)) {
      logout();
      return;
    }

    setUser((prev) => ({
      id: payload.id,
      role: payload.role,
      name: prev?.name || localStorage.getItem("userName") || "",
      email: fallbackEmail || prev?.email || localStorage.getItem("userEmail") || "",
    }));

    void refreshUser();
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
