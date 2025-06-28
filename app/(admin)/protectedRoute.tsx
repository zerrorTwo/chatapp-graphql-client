"use client";
import { ReactNode } from "react";
import useAuth from "@/app/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, status } = useAuth();

  if (status === "loading") {
    return <div></div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
