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
