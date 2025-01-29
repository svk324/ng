"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    toast.promise(
      async () => {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Logout failed");
        }

        router.push("/login");
      },
      {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Logout failed",
      }
    );
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Dashboard
            </Link>
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              Courses
            </Link>
            <Link
              href="/students-access"
              className="text-gray-600 hover:text-gray-900"
            >
              Students
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
