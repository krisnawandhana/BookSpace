"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); 

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      const t = localStorage.getItem("token");
      if (u && t) setUser(JSON.parse(u));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") {
        const u = localStorage.getItem("user");
        const t = localStorage.getItem("token");
        setUser(u && t ? JSON.parse(u) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (userObj, token) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("token", token);
    setUser(userObj);
    router.push("/dashboard");
    router.refresh(); 
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
    router.refresh();
  };

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, ready, login, logout }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};
