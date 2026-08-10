import { setToken } from "@/services/http";
import { useEffect } from "react";

export const useAuth = () => {
  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return { login, logout };
};

export default useAuth; 