// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "https://project-tracker-api-ie1b.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      // ✅ THE FIX: Destructure the 'token' and 'data' properties from the server's response body.
      const { token, data } = response.data;

      setToken(token);
      setUser(data.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(
        "https://project-tracker-api-ie1b.onrender.com/api/auth/register",
        {
          name,
          email,
          password,
        }
      );

      // ✅ THE FIX: Do the same for the register function.
      const { token, data } = response.data;

      setToken(token);
      setUser(data.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
