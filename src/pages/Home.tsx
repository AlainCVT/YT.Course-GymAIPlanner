import { Navigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth';

export default function Home() {
  const { user, isLoading } = useAuth();

  if (user && !isLoading) {
    return <Navigate to="/profile" replace />;
  }

  return <div>Home</div>;
}
