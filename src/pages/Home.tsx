import { ArrowRight, Calendar, Clock, type LucideIcon, Sparkles, Target, Zap } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/auth';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: 'AI-Powered Plans',
    description: 'Get a training program tailored to your goals, experience, and schedule.',
  },
  {
    icon: Target,
    title: 'Goal-Oriented',
    description:
      'Whether you want to build muscle, lose fat, or get stronger — we optimize for your goal.',
  },
  {
    icon: Calendar,
    title: 'Flexible Scheduling',
    description: 'Plans that fit your lifestyle. Train 2 days or 6 — we adapt to you.',
  },
  {
    icon: Clock,
    title: 'Time-Efficient',
    description: 'Every workout is designed to maximize results in your available time.',
  },
];

export default function Home() {
  const { user, isAuthLoading } = useAuth();

  if (!isAuthLoading && user) {
    return <Navigate to="/profile" replace />;
  }
  return (
    <div className="min-h-screen">
      <section className="relative flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 size-240 bg-accent/10 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Zap className="size-4 text-accent" />
            <span className="text-sm text-muted">AI-powered training plans</span>
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Your Perfect
            <br />
            <span className="text-accent">Gym Plan</span> in Seconds
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-10">
            Stop guessing. Get a personalized training program built by AI, tailored to your goals,
            experience, and schedule.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why GymAI?</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              We combine fitness expertise with AI to create programs that actually work for you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <Card
                key={`feature-${index}`}
                variant="bordered"
                className="group hover:border-accent/40! transition-colors"
              >
                <div className="size-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="size-6 text-accent" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
