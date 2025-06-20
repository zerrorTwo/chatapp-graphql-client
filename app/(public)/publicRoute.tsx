import { ReactNode } from 'react';

const PublicRoute = ({ children}: { children: ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}
export default PublicRoute;