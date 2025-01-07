import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@/hooks/use-user';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'technician' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useUser();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!user && !isLoading) {
      checkAuth();
    }
  }, [user, isLoading, checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      // Sauvegarder la page actuelle pour redirection après connexion
      sessionStorage.setItem('redirectAfterLogin', location);
      setLocation('/auth');
      return;
    }

    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      setLocation('/unauthorized');
    }
  }, [user, isLoading, requiredRole, setLocation, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}