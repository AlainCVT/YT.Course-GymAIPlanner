import clsx, { type ClassValue } from 'clsx';
import {
  Calendar,
  Dumbbell,
  Loader2,
  type LucideIcon,
  RefreshCcw,
  Target,
  TrendingUp,
} from 'lucide-react';
import type { JSX } from 'react/jsx-runtime';
import { Navigate } from 'react-router-dom';

import { PlanDisplay } from '@/components/partials/PlanDisplay';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/auth';

interface ProfileCardProps {
  className?: ClassValue;
  title: JSX.Element | string | number;
  text: JSX.Element | string | number;
  icon?: LucideIcon;
}

const DataCard = ({ className, title, text, icon: Icon }: ProfileCardProps) => (
  <Card variant="bordered" className={clsx('flex items-center gap-3', className)}>
    {Icon && (
      <div className="size-10 flex items-center justify-center">
        <Icon className="size-5 text-accent" />
      </div>
    )}
    <div>
      <p className="text-xs text-muted">{title}</p>
      <p className="font-medium text-sm">{text}</p>
    </div>
  </Card>
);

const ContentCard = ({ className, title, text }: ProfileCardProps) => (
  <Card variant="bordered" className={clsx(className)}>
    <h2 className="font-semibold text-lg mb-2">{title}</h2>
    <p className="text-muted text-sm leading-relaxed">{text}</p>
  </Card>
);

export default function Profile() {
  const { user, plan, isAuthLoading, isPlanLoading, isPlanGenerating, generatePlan } = useAuth();

  if (!user && !isAuthLoading) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (isAuthLoading || isPlanLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <Loader2 className="size-12 text-accent mx-auto animate-spin" />
      </div>
    );
  }

  if (!plan) {
    return <Navigate to="/onboarding" replace />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Your Training Plan</h1>
            <p className="text-muted">
              Version {plan.version} • Created {formatDate(plan.createdAt)}
            </p>
          </div>
          <Button
            variant="secondary"
            className={clsx('gap-2', { group: !isPlanGenerating })}
            disabled={isPlanGenerating}
            onClick={async () => await generatePlan()}
          >
            <RefreshCcw
              className={clsx(
                'size-4 origin-center transition-transform duration-0 group-hover:duration-400 group-hover:-rotate-180',
                {
                  'animate-[spin_1s_linear_infinite_reverse]': isPlanGenerating,
                },
              )}
            />
            Regenerate Plan
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <DataCard
            className="col-span-full"
            title="Goal"
            text={plan.overview.goal}
            icon={Target}
          />
          <DataCard title="Frequency" text={plan.overview.frequency} icon={Calendar} />
          <DataCard title="Split" text={plan.overview.split} icon={Dumbbell} />
          <DataCard title="Version" text={plan.version} icon={TrendingUp} />
        </div>
        <ContentCard className="mb-8" title="Program Notes" text={plan.overview.notes} />
        <h2 className="font-semibold text-xl mb-4">Weekly Schedule</h2>
        <PlanDisplay weeklySchedule={plan.weeklySchedule} />
        <ContentCard className="mb-8" title="Progression Strategy" text={plan.progression} />
      </div>
    </div>
  );
}
