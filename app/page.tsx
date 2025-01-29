// File: src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status using the API
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

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Show dashboard only if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/students-access">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Student Access Management</CardTitle>
              <CardDescription>
                Manage course access and certificates for students
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/courses">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Create and edit course content</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
