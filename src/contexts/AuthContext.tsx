import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import type { User, Role, AuthLoginResponse } from '../types/api';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (allowedRoles: Role[]) => boolean;
  canCreateTask: boolean;
  canAssignTask: boolean;
  canManageEquipment: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_TOKEN_KEY = 'alef_token';
const STORAGE_USER_KEY = 'alef_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Ouve evento global de 401 disparado pelo interceptor do Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('alef:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('alef:unauthorized', handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post<AuthLoginResponse>('/api/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;

      localStorage.setItem(STORAGE_TOKEN_KEY, receivedToken);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(receivedUser));

      setToken(receivedToken);
      setUser(receivedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (allowedRoles: Role[]): boolean => {
      if (!user) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );

  // Permissões de negócio conforme README RBAC
  const canCreateTask = useMemo(() => hasRole(['MANAGER', 'ANALYST']), [hasRole]);
  const canAssignTask = useMemo(
    () => hasRole(['MANAGER', 'ANALYST', 'SUPERVISOR', 'FOREMAN']),
    [hasRole]
  );
  const canManageEquipment = useMemo(
    () => hasRole(['MANAGER', 'ANALYST', 'SUPERVISOR', 'FOREMAN']),
    [hasRole]
  );

  const contextValue = useMemo<AuthContextData>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      logout,
      hasRole,
      canCreateTask,
      canAssignTask,
      canManageEquipment,
    }),
    [user, token, isLoading, login, logout, hasRole, canCreateTask, canAssignTask, canManageEquipment]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
