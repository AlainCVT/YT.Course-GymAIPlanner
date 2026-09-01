import { RedirectToSignIn, SignedIn } from '@neondatabase/neon-js/auth/react';
import { ArrowRight } from 'lucide-react';
import { type SubmitEvent, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/auth';
import type { Profile } from '@/types';

type OnboardingOptions = {
  [K in keyof Omit<Profile, 'injuries'>]: {
    label: string;
    options: SelectOption<Profile[K]>[];
  };
};

const ONBOARDING_OPTIONS = {
  goal: {
    label: "What's your primary goal?",
    options: [
      { value: 'bulk', label: 'Build Muscle (Bulk)' },
      { value: 'cut', label: 'Lose Fat (Cut)' },
      { value: 'recomp', label: 'Body Recomposition' },
      { value: 'strength', label: 'Build Strength' },
      { value: 'endurance', label: 'Improve Endurance' },
    ],
  },
  experience: {
    label: 'Training experience',
    options: [
      { value: 'beginner', label: 'Beginner (0-1 years)' },
      { value: 'intermediate', label: 'Intermediate (1-3 years)' },
      { value: 'advanced', label: 'Advanced (3+ years)' },
    ],
  },
  daysPerWeek: {
    label: 'Days per week',
    options: [
      { value: 2, label: '2 days per week' },
      { value: 3, label: '3 days per week' },
      { value: 4, label: '4 days per week' },
      { value: 5, label: '5 days per week' },
      { value: 6, label: '6 days per week' },
    ],
  },
  sessionLength: {
    label: 'Session length',
    options: [
      { value: 30, label: '30 minutes' },
      { value: 45, label: '45 minutes' },
      { value: 60, label: '60 minutes' },
      { value: 90, label: '90 minutes' },
    ],
  },
  equipment: {
    label: 'Equipment access',
    options: [
      { value: 'full_gym', label: 'Full Gym Access' },
      { value: 'home', label: 'Home Gym' },
      { value: 'dumbbells', label: 'Dumbbells Only' },
    ],
  },
  preferredSplit: {
    label: 'Preferred training split',
    options: [
      { value: 'full_body', label: 'Full Body' },
      { value: 'upper_lower', label: 'Upper/Lower Split' },
      { value: 'ppl', label: 'Push/Pull/Legs' },
      { value: 'custom', label: 'Let AI Decide' },
    ],
  },
} as const satisfies OnboardingOptions;

export default function Onboarding() {
  const { user, saveProfile } = useAuth();

  const [formData, setFormData] = useState<Required<Profile>>({
    goal: 'bulk',
    experience: 'intermediate',
    daysPerWeek: 4,
    sessionLength: 60,
    equipment: 'full_gym',
    preferredSplit: 'upper_lower',
    injuries: '',
  });

  if (!user) {
    return <RedirectToSignIn />;
  }

  const handleQuestionnaire = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveProfile(formData);
  };

  const updateForm = <T extends keyof Profile>(field: T, value: Profile[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SignedIn>
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-xl mx-auto">
          <Card variant="bordered">
            <h1 className="text-2xl font-bold mb-2">Tell us about yourself</h1>
            <p className="text-muted mb-6">Help us create the perfect plan for you</p>
            <form onSubmit={handleQuestionnaire} className="grid grid-cols-2 gap-5">
              {Object.entries(ONBOARDING_OPTIONS).map(([id, data]) => (
                <Select
                  key={id}
                  id={id}
                  label={data.label}
                  options={data.options}
                  value={formData[id]}
                  onValueChange={(value) => updateForm(id, value)}
                />
              ))}
              <Textarea
                id="injuries"
                className="col-span-full"
                label="Any injuries or limitations? (optional)"
                placeholder="E.g., lower back issues, shoulder impingement…"
                rows={3}
                value={formData.injuries}
                onChange={(event) => updateForm('injuries', event.target.value)}
              />
              <Button type="submit" className="flex-1 mt-2 gap-2 col-span-full">
                Generate My Plan <ArrowRight className="size-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </SignedIn>
  );
}
