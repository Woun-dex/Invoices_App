import React, { createContext, useContext, useState, useEffect  } from 'react';
import type { ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, getUserProfile } from '../api/auth';

// 1. Define a strong type for your User object
interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

// 2. Define the shape of your context value
interface AuthContextValue {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
}

// 3. Create the context with a 'null' default for type safety
const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])
  const login = async (payload: { username: string; password: string }) => {
    setLoading(true);
    try {
      const data = await apiLogin(payload)
      setToken(data.access_token)
      setUser(data.user ?? null)
    } finally {
      setLoading(false);
    }
  }

  const register = async (payload: { username: string; email: string; password: string; name?: string }) => {
    setLoading(true);
    try {
      const { username, email, password, name } = payload;
      const data = await apiRegister({ username, email, password });
      setToken(data.access_token);
      setUser(data.user ?? null);
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
