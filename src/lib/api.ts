import type { Profile, UserProfile } from '@/types';

const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  throw new Error('API URL is not defined');
}

async function post(path: `/${string}`, body: object) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');

  return res.json();
}

export const api = {
  saveProfile: async (userId: UserProfile['userId'], profile: Profile) => {
    post('/profile', { userId, ...profile });
  },
};
