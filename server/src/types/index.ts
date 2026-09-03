import { UserProfiles } from '@/generated/prisma/client';

export type UserProfileData = Omit<UserProfiles, 'user_id' | 'updated_at'>;

interface PlanOverview {
  goal: string;
  frequency: string;
  split: string;
  notes: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number;
  notes?: string;
  alternatives?: string[];
}

interface DaySchedule {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlanData {
  overview: PlanOverview;
  weeklySchedule: DaySchedule[];
  progression: string;
}
