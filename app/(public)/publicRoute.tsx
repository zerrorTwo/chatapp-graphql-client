'use client';
import { ReactNode } from 'react';
import useAuthenticated from '@/app/hooks/useAuthenticated';

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { session, status } = useAuthenticated();
  if (status === 'loading') {
    return <div></div>;
  }
  if (session) {
    return null;
  }
  return (
    <div>
      {children}
    </div>
  );
};
export default PublicRoute;