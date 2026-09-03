import type { Profile, TrainingPlanData, UserProfile } from '@/types';

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error('API URL is not defined.');
}

async function post<T>(path: `/${string}`, body: object) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');

  return res.json() as T;
}

async function get<T>(path: `/${string}`) {
  const res = await fetch(`${API_URL}/api${path}`);

  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');

  return res.json() as T;
}

export const api = {
  saveProfile: async (userId: UserProfile['userId'], profile: Profile) => {
    return post<{ success: boolean }>('/profile', { userId, ...profile });
  },
  generatePlan: async (userId: UserProfile['userId']) => {
    return post<{ success: boolean; id: string; version: number; createdAt: string }>(
      '/plan/generate',
      { userId },
    );
  },
  getCurrentPlan: async (userId: UserProfile['userId']) => {
    return get<{
      id: string;
      userId: string;
      planJson: TrainingPlanData;
      planText: string;
      version: number;
      createdAt: string;
    }>(`/plan/current?userId=${userId}`);
  },
};
