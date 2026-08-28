import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { loginUser, exchangeAuth0Token } from '../api/authApi';

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
  const storedUser = loadStoredUser();

  const [user, setUser] = useState(storedUser);
  const [role, setRole] = useState(storedUser?.role || null);
  const [token, setToken] = useState(
    localStorage.getItem('token') || null
  );

  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);

  const { logout: auth0Logout } = useAuth0();

  useEffect(() => {
    if (token && !user) {
      const stored = loadStoredUser();

      if (stored) {
        setUser(stored);
        setRole(stored.role);
      }
    }
  }, [token, user]);

  // Normal email/password login
  const login = async (credentials) => {
    setLoading(true);

    try {
      const data = await loginUser(credentials);

      const loggedInUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(loggedInUser);
      setRole(data.role);
      setToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      );

      return loggedInUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Auth0 / Google login
  const loginWithAuth0 = async (accessToken) => {
    setLoading(true);
    setAuthInProgress(true);

    try {
      console.debug(
        '[AUTH FLOW] AuthContext exchange started:'
      );

      const data = await exchangeAuth0Token(accessToken);

      const loggedInUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      setUser(loggedInUser);
      setRole(data.role);
      setToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      );

      console.debug(
        '[AUTH FLOW] AuthContext exchange succeeded:',
        {
          user: {
            id: loggedInUser.id,
            email: loggedInUser.email,
          },
          role: data.role,
        }
      );
      console.debug('[AUTH FLOW] BugFlow token stored');

      return loggedInUser;
    } catch (error) {
      console.error(
        'Auth0 login failed:',
        error
      );

      throw error;
    } finally {
      setLoading(false);
      setAuthInProgress(false);
    }
  };

  // Logout from BugFlow + Auth0
  const logout = async () => {
    // Clear BugFlow session
    setUser(null);
    setRole(null);
    setToken(null);
    setAuthInProgress(false);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Prevent Auth0Handler from exchanging an old session
    try {
      localStorage.setItem('auth0Logout', '1');
      localStorage.removeItem('auth0LoginInitiated');
    } catch (error) {
      console.warn(
        'Could not update Auth0 logout flags',
        error
      );
    }

    // Logout from Auth0
    try {
      console.debug(
        'AuthContext: logging out from Auth0'
      );

      await auth0Logout({
        logoutParams: {
          // Use the running app origin so local dev on other ports works
          returnTo: `${window.location.origin}/login`,
        },
      });
    } catch (error) {
      console.error(
        'Auth0 logout failed:',
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        authInProgress,
        login,
        loginWithAuth0,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};