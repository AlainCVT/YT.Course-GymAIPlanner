import type { User as NeonUser } from '@neondatabase/neon-js/auth/types';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

import { api } from '@/lib/api';
import { authClient } from '@/lib/auth';
import type { Profile } from '@/types';

interface AuthContextType {
  user: NeonUser | null;
  isLoading: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
  generatePlan: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const saveProfile = async (profile: Profile) => {
    if (!user) {
      throw new Error('User must be authenticated to save profile.');
    }

    await api.saveProfile(user.id, profile);
  };

  const generatePlan = async () => {
    if (!user) {
      throw new Error('User must be authenticated to generate plan.');
    }

    await api.generatePlan(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, saveProfile, generatePlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
};
