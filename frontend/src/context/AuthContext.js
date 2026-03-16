import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [token, setToken]   = useState(localStorage.getItem('bio_token'));
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('bio_token'));
  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);
  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token); setIsAdmin(true);
    localStorage.setItem('bio_token', res.data.token);
    return res.data;
  };
  const logout = () => {
    setToken(null); setIsAdmin(false);
    localStorage.removeItem('bio_token');
    delete axios.defaults.headers.common['Authorization'];
  };
  return <AuthContext.Provider value={{ token, isAdmin, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
