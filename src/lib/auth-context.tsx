"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type MockUser,
  getCurrentUser,
  signIn as mockSignIn,
  signUp as mockSignUp,
  signOut as mockSignOut,
  updateCurrentUser,
} from "@/lib/mock-auth";

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => { user: MockUser | null; error: string | null };
  signUp: (data: { name: string; email: string; password: string }) => { user: MockUser | null; error: string | null };
  signOut: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setIsLoading(false);
  }, []);

  const handleSignIn = useCallback((email: string, password: string) => {
    const result = mockSignIn(email, password);
    if (result.user) setUser(result.user);
    return result;
  }, []);

  const handleSignUp = useCallback((data: { name: string; email: string; password: string }) => {
    const result = mockSignUp(data);
    if (result.user) setUser(result.user);
    return result;
  }, []);

  const handleSignOut = useCallback(() => {
    mockSignOut();
    setUser(null);
  }, []);

  const handleUpdateUser = useCallback((updates: Partial<MockUser>) => {
    const updated = updateCurrentUser(updates);
    if (updated) setUser(updated);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        updateUser: handleUpdateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
