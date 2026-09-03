import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth';

export default function Home() {
  const { user, isAuthLoading } = useAuth();

  if (user && !isAuthLoading) {
    return <Navigate to="/profile" replace />;
  }

  return <div>Home</div>;
}
