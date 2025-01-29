"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
