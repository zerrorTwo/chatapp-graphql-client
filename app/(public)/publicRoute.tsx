"use client";

import { ReactNode } from "react";
import useAuthenticated from "@/app/hooks/useAuthenticated";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { status, isAuthenticated } = useAuthenticated();

  if (status === "loading") {
    return <div>Loading...</div>; // Có thể thay bằng spinner
  }

  if (isAuthenticated) {
    return null; // Nếu đã login rồi thì không cho vào trang public
  }

  return <>{children}</>;
};

export default PublicRoute;
