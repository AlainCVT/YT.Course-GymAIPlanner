import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const user = false;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <Dumbbell className="size-6 text-accent" />
          <span className="font-semibold text-lg">GymAI</span>
        </Link>
        <nav>
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  My plan
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
