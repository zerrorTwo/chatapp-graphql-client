'use client';
import { ReactNode } from 'react';
import useAuth from '@/app/hooks/useAuth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, status } = useAuth();
  if (status === 'loading') {
    return <div></div>;
  }
  if (!session) {
    return null;
  }
  return (
    <div>
      <h1>Protected Route</h1>
      {children}
    </div>
  );
};

export default ProtectedRoute;