import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/hooks/use-user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'guest' | 'technician' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, checkAuth } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      checkAuth();
    }
  }, [user, checkAuth]);

  useEffect(() => {
    if (!user) {
      setLocation('/');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      setLocation('/unauthorized');
    }
  }, [user, requiredRole, setLocation]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
