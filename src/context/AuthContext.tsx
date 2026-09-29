import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 *
 * The session is kept **in-memory only** (React state + the axios
 * `Authorization` default header). It is intentionally NOT persisted to
 * `localStorage` or `sessionStorage` so that a full page refresh ends the
 * session — on reload the React tree is re-created with `user === null`,
 * which causes `ProtectedRoute` to redirect to `/login`.
 *
 * In-memory state still survives normal client-side navigation (link clicks
 * / `navigate()` that don't trigger a hard reload), so a logged-in user can
 * move freely around the app until they refresh or close the tab.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // A new session is created every time `login` is called.
  const login = (userData: User) => {
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  // The session is ended (state cleared, auth header revoked).
  const logout = () => {
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
