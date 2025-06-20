import { ReactNode } from 'react';

const ProtectedRoute = ({ children}: { children: ReactNode }) => {
  return (
    <div>
      <h1>Protected Route</h1>
      {children}
    </div>
  )
}

export default ProtectedRoute;