export interface Profile {
  goal: 'cut' | 'bulk' | 'recomp' | 'strength' | 'endurance';
  experience: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: 2 | 3 | 4 | 5 | 6;
  sessionLength: 30 | 45 | 60 | 90;
  equipment: 'full_gym' | 'home' | 'dumbbells';
  preferredSplit: 'full_body' | 'upper_lower' | 'ppl' | 'custom';
  injuries?: string;
}

export interface UserProfile extends Profile {
  userId: string;
  updatedAt: string;
}

interface PlanOverview {
  goal: string;
  frequency: string;
  split: string;
  notes: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  rpe: number;
  notes?: string;
  alternatives?: string[];
}

export interface DaySchedule {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface TrainingPlanData {
  overview: PlanOverview;
  weeklySchedule: DaySchedule[];
  progression: string;
}

export interface TrainingPlan extends TrainingPlanData {
  id: string;
  userId: string;
  version: number;
  createdAt: string;
}
