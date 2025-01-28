// File: src/app/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
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
