import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/httpClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("smartspend_user")) || null);
  const [token, setToken] = useState(() => localStorage.getItem("smartspend_token"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("smartspend_token")));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("smartspend_theme") !== "light");
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        localStorage.setItem("smartspend_user", JSON.stringify(data.user));
        setUser(data.user);
      } catch (error) {
        setToken(null);
        setUser(null);
      } finally {
        setBooting(false);
      }
    };

    refreshSession();
  }, [token]);

  const saveSession = (data) => {
    localStorage.setItem("smartspend_token", data.token);
    localStorage.setItem("smartspend_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const login = async (form) => {
    const { data } = await api.post("/auth/login", form);
    saveSession(data);
  };

  const register = async (form) => {
    const { data } = await api.post("/auth/register", form);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem("smartspend_token");
    localStorage.removeItem("smartspend_user");
    setToken(null);
    setUser(null);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("smartspend_theme", isDark ? "dark" : "light");
  };

  return (
    <AuthContext.Provider value={{ user, token, booting, login, register, logout, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
