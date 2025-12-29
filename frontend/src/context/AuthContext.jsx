import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, login as loginRequest, signup as signupRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = window.localStorage.getItem('user');
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.warn('Invalid user payload in storage, clearing.');
      window.localStorage.removeItem('user');
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(true);

  const persistAuth = useCallback((nextToken, nextUser) => {
    if (nextToken) {
      window.localStorage.setItem('token', nextToken);
    } else {
      window.localStorage.removeItem('token');
    }

    if (nextUser) {
      window.localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem('user');
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persistAuth(null, null);
  }, [persistAuth]);

  useEffect(() => {
    const initialize = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        const currentUser = response.data.data;
        setUser(currentUser);
        persistAuth(token, currentUser);
      } catch (error) {
        console.error('Failed to load current user.', error);
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [token, logout, persistAuth]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginRequest(credentials);
      const { token: nextToken, user: authenticatedUser } = response.data.data;
      setToken(nextToken);
      setUser(authenticatedUser);
      persistAuth(nextToken, authenticatedUser);
      return authenticatedUser;
    },
    [persistAuth],
  );

  const signup = useCallback(async (payload) => {
    const response = await signupRequest(payload);
    return response.data;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) {
      return null;
    }
    const response = await getCurrentUser();
    const currentUser = response.data.data;
    setUser(currentUser);
    persistAuth(token, currentUser);
    return currentUser;
  }, [token, persistAuth]);

  const updateStoredUser = useCallback(
    (nextUser) => {
      setUser(nextUser);
      persistAuth(token, nextUser);
    },
    [persistAuth, token],
  );

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isInitializing,
      login,
      signup,
      logout,
      refreshUser,
      setUser: updateStoredUser,
    }),
    [token, user, isInitializing, login, signup, logout, refreshUser, updateStoredUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
