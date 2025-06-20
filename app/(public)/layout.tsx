import PublicRoute from '@/app/(public)/publicRoute';
import { ReactNode } from 'react';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <PublicRoute>{children}</PublicRoute>
  )
}

export default AppLayout