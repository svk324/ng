"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AddStudentForm from "@/components/AddStudentForm";
import { toast } from "sonner";
import { Trash2, ExternalLink } from "lucide-react";
import ConfirmationAlert from "@/components/ConfirmationAlert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Student {
  id: string;
  studentEmail: string;
  certificateUrl?: string;
  details?: {
    name?: string;
    phone?: string;
    notes?: string;
  };
}

interface Course {
  id: string;
  title: string;
  students: Student[];
}

interface EditingStudent {
  studentEmail: string;
  certificateUrl?: string;
}

export default function CourseStudentsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState<EditingStudent | null>(
    null
  );

  useEffect(() => {
    fetch(`/api/courses/${courseId}?include=students`)
      .then((res) => res.json())
      .then((data) => {
        // Ensure students array exists
        setCourse({
          ...data,
          students: data.students || [],
        });
      })
      .catch((error) => toast.error("Failed to load course"));
  }, [courseId]);

  const handleRemoveStudent = async (studentEmail: string) => {
    try {
      const response = await fetch(
        `/api/students/access/${courseId}/${encodeURIComponent(studentEmail)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove student");

      setCourse((course) =>
        course
          ? {
              ...course,
              students: course.students.filter(
                (student) => student.studentEmail !== studentEmail
              ),
            }
          : null
      );

      toast.success("Student removed successfully");
    } catch (error) {
      toast.error("Failed to remove student");
    }
  };

  const handleUpdateStudent = async (
    originalEmail: string,
    updates: { studentEmail?: string; certificateUrl?: string }
  ) => {
    try {
      const response = await fetch(
        `/api/students/access/${courseId}/${encodeURIComponent(
          originalEmail
        )}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newEmail: updates.studentEmail,
            certificateUrl: updates.certificateUrl,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update student");

      const updatedStudent = await response.json();

      setCourse((prevCourse) => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          students: prevCourse.students.map((student) =>
            student.studentEmail === originalEmail
              ? {
                  ...student,
                  studentEmail: updates.studentEmail || student.studentEmail,
                  certificateUrl: updates.certificateUrl,
                }
              : student
          ),
        };
      });

      setEditingStudent(null);
      toast.success("Student updated successfully");
    } catch (error) {
      toast.error("Failed to update student");
    }
  };

  // Filter students based on search query
  const filteredStudents =
    course?.students.filter((student) =>
      student.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <ConfirmationAlert
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            handleRemoveStudent(studentToDelete);
            setStudentToDelete(null);
          }
        }}
        title="Confirm Deletion"
        message="Are you sure you want to remove this student?"
      />

      {editingStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Student</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateStudent(editingStudent.studentEmail, {
                  studentEmail: formData.get("email") as string,
                  certificateUrl: formData.get("certificateUrl") as string,
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStudent.studentEmail}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Certificate URL
                  </label>
                  <input
                    type="url"
                    name="certificateUrl"
                    defaultValue={editingStudent.certificateUrl || ""}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingStudent(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">{course.title}</h1>
        <AddStudentForm courseId={course.id} />
      </div>

      {/* Add search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-sm px-4 py-2 border rounded-md"
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p className="text-center text-gray-500 my-8">
          {course.students.length === 0
            ? "No students have been added to this course yet."
            : "No students found matching your search."}
        </p>
      ) : (
        <div className="border rounded-lg">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px] sm:min-w-[250px]">
                    Student Email
                  </TableHead>
                  <TableHead className="min-w-[150px] sm:min-w-[200px]">
                    Certificate
                  </TableHead>
                  <TableHead className="min-w-[150px] sm:min-w-[200px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentEmail}>
                    <TableCell className="font-medium">
                      {student.studentEmail}
                    </TableCell>
                    <TableCell>
                      {student.certificateUrl ? (
                        <a
                          href={student.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline inline-flex items-center gap-1"
                        >
                          View Certificate
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="text-gray-500">No certificate</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingStudent({
                              studentEmail: student.studentEmail,
                              certificateUrl: student.certificateUrl,
                            })
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            setStudentToDelete(student.studentEmail)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
