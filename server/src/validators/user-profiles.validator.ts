import { z } from 'zod';

import { Equipment, Experience, Goal, PreferredSplit } from '@/generated/prisma/enums';

const GOALS: Goal[] = ['cut', 'bulk', 'recomp', 'strength', 'endurance'];
const EXPERIENCE: Experience[] = ['beginner', 'intermediate', 'advanced'];
const EQUIPMENT: Equipment[] = ['full_gym', 'home', 'dumbbells'];
const PREFERRED_SPLIT: PreferredSplit[] = ['full_body', 'upper_lower', 'ppl', 'custom'];

export const userData = z.object({
  userId: z.uuid(),
});

export const userProfilesSchema = userData.extend(
  z.object({
    goal: z.enum(GOALS),
    experience: z.enum(EXPERIENCE),
    daysPerWeek: z.int().min(0),
    sessionLength: z.int().min(0),
    equipment: z.enum(EQUIPMENT),
    preferredSplit: z.enum(PREFERRED_SPLIT),
    injuries: z.string().optional(),
  }).shape,
);

export type UserData = z.infer<typeof userData>;
export type UserProfilesRequest = z.infer<typeof userProfilesSchema>;
