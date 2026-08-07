'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser } from '@/services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  avatar?: string;
  memberSince?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthOpen: boolean;
  authMode: 'login' | 'register' | 'forgot';
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  openAuth: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuth: () => void;
  setAuthMode: (mode: 'login' | 'register' | 'forgot') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback mock users for offline / preview
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Quản trị viên Luxe',
    email: 'admin@luxe.vn',
    password: 'admin123',
    role: 'ADMIN',
    memberSince: '2024-01-01',
  },
  {
    id: '2',
    name: 'Nguyễn Văn Khoa',
    email: 'user@luxe.vn',
    password: '123456',
    role: 'USER',
    memberSince: '2024-01-01',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('luxe_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    // Try backend API first
    const apiUser = await loginUser(email, password);
    if (apiUser) {
      const userData: User = {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
        avatar: apiUser.avatar,
        memberSince: apiUser.memberSince,
      };
      setUser(userData);
      localStorage.setItem('luxe_user', JSON.stringify(userData));
      setIsAuthOpen(false);
      return userData;
    }

    // Fallback to local mock users if backend server unreachable or credentials match mock
    const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (found) {
      const { password: _, ...userData } = found;
      setUser(userData);
      localStorage.setItem('luxe_user', JSON.stringify(userData));
      setIsAuthOpen(false);
      return userData;
    }

    return null;
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    const apiUser = await registerUser(name, email, password);
    if (apiUser) {
      const userData: User = {
        id: String(apiUser.id),
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
        memberSince: apiUser.memberSince || new Date().toISOString().split('T')[0],
      };
      setUser(userData);
      localStorage.setItem('luxe_user', JSON.stringify(userData));
      setIsAuthOpen(false);
      return userData;
    }

    // Fallback if backend API offline
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'USER',
      memberSince: new Date().toISOString().split('T')[0],
    };
    setUser(newUser);
    localStorage.setItem('luxe_user', JSON.stringify(newUser));
    setIsAuthOpen(false);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('luxe_user');
  };

  const openAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => setIsAuthOpen(false);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isAuthOpen, authMode,
      login, register, logout, openAuth, closeAuth, setAuthMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
