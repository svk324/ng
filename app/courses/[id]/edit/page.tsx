// File: src/app/courses/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Section {
  title: string;
  videoUrl: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sections: Section[];
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    // Fetch course data
    fetch(`/api/courses/${params.id}`)
      .then((res) => res.json())
      .then((data) => setCourse(data));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      const response = await fetch(`/api/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        throw new Error("Failed to update course");
      }

      router.push("/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      // Add error handling UI here
    }
  };

  if (!course) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Title</label>
            <Input
              value={course.title}
              onChange={(e) => setCourse({ ...course, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <Textarea
              value={course.description}
              onChange={(e) =>
                setCourse({ ...course, description: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block mb-2">Image URL</label>
            <Input
              value={course.imageUrl}
              onChange={(e) =>
                setCourse({ ...course, imageUrl: e.target.value })
              }
              required
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sections</h3>
            {course.sections.map((section, index) => (
              <div key={index} className="space-y-4 mb-4">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...course.sections];
                    newSections[index].title = e.target.value;
                    setCourse({ ...course, sections: newSections });
                  }}
                />
                <Input
                  placeholder="Video URL"
                  value={section.videoUrl}
                  onChange={(e) => {
                    const newSections = [...course.sections];
                    newSections[index].videoUrl = e.target.value;
                    setCourse({ ...course, sections: newSections });
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCourse({
                  ...course,
                  sections: [...course.sections, { title: "", videoUrl: "" }],
                })
              }
            >
              Add Section
            </Button>
          </div>
          <Button type="submit">Update Course</Button>
        </form>
      </Card>
    </div>
  );
}
