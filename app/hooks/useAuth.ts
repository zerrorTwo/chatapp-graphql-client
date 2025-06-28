"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "access_token";

const useAuth = () => {
  const router = useRouter();

  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
      router.push("/login"); // 👈 chuyển hướng nếu chưa login
    }
  }, [router]);

  return {
    status,
    isAuthenticated: status === "authenticated",
  };
};

export default useAuth;
