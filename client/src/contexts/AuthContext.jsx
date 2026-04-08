import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authApi } from '../api/auth.api.js';
import authStore from '../store/authStore';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialized = useRef(false);

  // 1. Initial boot check
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      try {
        // Even if no memory token, we try /me to check for HTTP-only cookie session
        const { data } = await authApi.getMe();
        setUser(data.data);
      } catch {
        // Silent fail for guests
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // 2. Sync with authStore (e.g. login/logout from other components or tabs)
  useEffect(() => {
    const unsubscribe = authStore.subscribe(async (newToken) => {
      if (newToken) {
        try {
          const { data } = await authApi.getMe();
          setUser(data.data);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await authApi.login(credentials);
      
      // Store token safely in memory
      authStore.setToken(data.data.accessToken);
      
      setUser(data.data.user);
      toast.success('Successfully logged in');
      
      return data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authApi.register(userData);
      toast.success('Successfully registered. Please log in.');
      return data.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      console.error('Logout API failed, continuing client logout');
    } finally {
      authStore.clearToken();
      setUser(null);
      toast.success('Successfully logged out');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
