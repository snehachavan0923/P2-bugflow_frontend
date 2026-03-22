import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const loadStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser());
  const [role, setRole] = useState(loadStoredUser()?.role || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      const stored = loadStoredUser();
      if (stored) {
        setUser(stored);
        setRole(stored.role);
      }
    }
  }, [token, user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await loginUser(credentials);
      const loggedInUser = data.user || { email: credentials.email, role: 'Owner' };

      setUser(loggedInUser);
      setRole(loggedInUser.role || 'Owner');
      setToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};