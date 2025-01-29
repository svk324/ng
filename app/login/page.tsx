// File: src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    toast.promise(
      async () => {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        router.push("/courses");
        router.refresh();
      },
      {
        loading: "Logging in...",
        success: "Logged in successfully",
        error: (err) => (err instanceof Error ? err.message : "Login failed"),
      }
    );
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Email</label>
              <Input name="email" type="email" required />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <Input name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
