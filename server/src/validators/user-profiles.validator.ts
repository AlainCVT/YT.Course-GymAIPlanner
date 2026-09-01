import { z } from 'zod';

export const userProfilesSchema = z.object({
  userId: z.uuid(),
  goal: z.string().max(20),
  experience: z.string().max(20),
  daysPerWeek: z.int().min(0),
  sessionLength: z.int().min(0),
  equipment: z.string().max(20),
  preferredSplit: z.string().max(20),
  injuries: z.string().optional(),
});

export type UserProfilesRequest = z.infer<typeof userProfilesSchema>;
