// lib/auth/withAuth.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';

const withAuth = (Component: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/signin'); // Redirect to sign-in page if not authenticated
      }
    }, [user, router]);

    if (!user) {
      return null; // Render nothing or a loader while checking auth state
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
