import { ReactNode } from 'react';
import ProtectedRoute from '@/app/(admin)/protectedRoute';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>{children}</ProtectedRoute>
  )
}

export default AppLayout