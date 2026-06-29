import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Role } from '../types';
import { MOCK_USERS } from '../utils/mockData';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(email: string, _password: string): boolean {
    const user = MOCK_USERS.find((u) => u.email === email && u.actif);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  function hasRole(roles: Role[]): boolean {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
