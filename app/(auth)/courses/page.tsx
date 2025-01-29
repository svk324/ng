// File: src/app/courses/page.tsx
import { PrismaClient } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      sections: true,
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Link href="/courses/new">
          <Button>Create New Course</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-40 object-cover mb-4"
              />
              <p className="text-sm mb-4">{course.description}</p>
              <Link href={`/courses/${course.id}/edit`}>
                <Button variant="outline" className="w-full">
                  Edit Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
