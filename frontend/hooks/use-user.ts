"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/actions/auth.actions";

type User = {
  user_id: number;
  name: string;
  email: string;
};

type Response = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
};

export const useUser = (): Response => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token")
          : null;

      setIsAuthenticated(!!token);

      if (token) {
        const currentUser = await getCurrentUser(token);
        setUser(currentUser?.data || null);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  return { isAuthenticated, user, loading };
};
