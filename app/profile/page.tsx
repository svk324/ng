"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (response.ok) {
        setIsEditing(false);
        setNewPassword("");
      }
    } catch (error) {
      console.error("Failed to update password:", error);
    }
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
            <label className="font-semibold">Email</label>
            <p>{user.email}</p>
          </div>
          {isEditing ? (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="font-semibold">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
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
