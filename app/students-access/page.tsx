// File: src/app/students-access/page.tsx
import { PrismaClient } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AddStudentForm from "@/components/AddStudentForm";

const prisma = new PrismaClient();

export default async function StudentsAccessPage() {
  const courses = await prisma.course.findMany({
    include: {
      students: true,
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Student Access Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <AddStudentForm courseId={course.id} />
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Enrolled Students</h3>
                <ul className="space-y-2">
                  {course.students.map((student) => (
                    <li key={student.id} className="text-sm">
                      {student.studentEmail}
                      {student.certificateUrl && (
                        <a
                          href={student.certificateUrl}
                          className="text-blue-500 ml-2"
                        >
                          View Certificate
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
