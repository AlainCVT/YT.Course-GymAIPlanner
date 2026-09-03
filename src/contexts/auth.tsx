import type { User as NeonUser } from '@neondatabase/neon-js/auth/types';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { api } from '@/lib/api';
import { authClient } from '@/lib/auth';
import type { Profile, TrainingPlan } from '@/types';

interface AuthContextType {
  user: NeonUser | null;
  plan: TrainingPlan | null;
  isAuthLoading: boolean;
  isPlanLoading: boolean;
  isPlanGenerating: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isPlanLoading, setIsPlanLoading] = useState<boolean>(true);
  const [isPlanGenerating, setIsPlanGenerating] = useState<boolean>(false);
  const isRefreshingRef = useRef<boolean>(false);

  const refreshData = useCallback(async () => {
    if (!user || isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setIsPlanLoading(true);

    try {
      const planData = await api.getCurrentPlan(user.id).catch(() => null);

      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      isRefreshingRef.current = false;
      setIsPlanLoading(false);
    }
  }, [user]);

  const saveProfile = async (profile: Profile) => {
    if (!user) {
      throw new Error('User must be authenticated to save profile.');
    }

    await api.saveProfile(user.id, profile);
    await refreshData();
  };

  const generatePlan = async () => {
    if (!user) {
      throw new Error('User must be authenticated to generate plan.');
    }

    try {
      setIsPlanGenerating(true);
      await api.generatePlan(user.id);
      await refreshData();
    } finally {
      setIsPlanGenerating(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsAuthLoading(true);
        const result = await authClient.getSession();
        if (result && result.data?.user) {
          setUser(result.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    loadUser();
  }, [user?.id]);

  useEffect(() => {
    const checkData = async () => {
      if (!isAuthLoading) {
        if (user?.id) {
          await refreshData();
        } else {
          setPlan(null);
          setIsPlanLoading(false);
        }
      }
    };
    checkData();
  }, [user?.id, isAuthLoading, refreshData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        plan,
        isAuthLoading,
        isPlanLoading,
        isPlanGenerating,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
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
