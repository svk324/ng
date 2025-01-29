"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setUser(data);
      })
      .catch((error) => {
        toast.error(error.message || "Failed to load user data");
        router.push("/login"); // Redirect to login page if unauthorized
      });
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast.promise(
      async () => {
        const response = await fetch("/api/auth/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update password");
        }

        setIsEditing(false);
        setNewPassword("");
      },
      {
        loading: "Updating password...",
        success: "Password updated successfully",
        error: (err) => err.message,
      }
    );

    setIsLoading(false);
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    toast.promise(
      async () => {
        const response = await fetch("/api/auth/email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: newEmail }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update email");
        }

        setUser({ ...user!, email: newEmail });
        setIsEditingEmail(false);
        setNewEmail("");
      },
      {
        loading: "Updating email...",
        success: "Email updated successfully",
        error: (err) => err.message,
      }
    );

    setIsLoading(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            {isEditingEmail ? (
              <form onSubmit={handleEmailChange} className="space-y-4">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter new email"
                />
                <div className="flex space-x-2">
                  <Button type="submit" disabled={isLoading}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingEmail(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center space-x-2">
                <p>{user?.email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingEmail(true)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Enter new password"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Password must contain at least 8 characters, one uppercase
                  letter, one lowercase letter, one number, and one special
                  character.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={isLoading}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Change Password</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
