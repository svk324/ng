// File: src/app/students-access/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddStudentForm from "@/components/AddStudentForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmationAlert from "@/components/ConfirmationAlert";

interface Student {
  id: string;
  studentEmail: string;
  certificateUrl?: string;
}

interface Course {
  id: string;
  title: string;
  students: Student[];
}

export default function StudentsAccessPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [studentToDelete, setStudentToDelete] = useState<{
    courseId: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/courses?include=students")
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => toast.error("Failed to load courses"));
  }, []);

  const handleRemoveStudent = async (
    courseId: string,
    studentEmail: string
  ) => {
    try {
      const response = await fetch(
        `/api/students/access/${courseId}/${encodeURIComponent(studentEmail)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove student");
      }

      // Update local state
      setCourses(
        courses.map((course) => {
          if (course.id === courseId) {
            return {
              ...course,
              students: course.students.filter(
                (student) => student.studentEmail !== studentEmail
              ),
            };
          }
          return course;
        })
      );

      toast.success("Student removed successfully");
    } catch (error) {
      toast.error("Failed to remove student");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ConfirmationAlert
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            handleRemoveStudent(
              studentToDelete.courseId,
              studentToDelete.email
            );
            setStudentToDelete(null);
          }
        }}
        title="Confirm Deletion"
        message="Are you sure you want to remove this student?"
      />

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
                    <li
                      key={student.id}
                      className="text-sm flex items-center justify-between"
                    >
                      <div>
                        {student.studentEmail}
                        {student.certificateUrl && (
                          <a
                            href={student.certificateUrl}
                            className="text-blue-500 ml-2"
                          >
                            View Certificate
                          </a>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setStudentToDelete({
                            courseId: course.id,
                            email: student.studentEmail,
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
