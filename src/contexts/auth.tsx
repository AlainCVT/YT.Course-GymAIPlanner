import type { User as NeonUser } from '@neondatabase/neon-js/auth/types';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { authClient } from '@/lib/auth';

interface AuthContextType {
  user: NeonUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<NeonUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession();
        if (result && result.data?.user) {
          setUser(result.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
