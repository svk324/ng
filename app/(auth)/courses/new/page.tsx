"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Video {
  title: string;
  videoUrl: string;
}

interface Section {
  title: string;
  videos: Video[];
}

export default function NewCoursePage() {
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([
    { title: "", videos: [{ title: "", videoUrl: "" }] },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const courseData = {
      title: formData.get("title"),
      description: formData.get("description"),
      imageUrl: formData.get("imageUrl"),
      sections: sections.filter(
        (section) =>
          section.title && section.videos.some((v) => v.title && v.videoUrl)
      ),
    };

    toast.promise(
      async () => {
        const response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(courseData),
        });

        if (!response.ok) {
          throw new Error("Failed to create course");
        }

        router.push("/courses");
        router.refresh();
      },
      {
        loading: "Creating course...",
        success: "Course created successfully",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to create course",
      }
    );
    setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Course</h1>
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <div>
            <label className="block mb-2">Title</label>
            <Input name="title" required />
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <Textarea name="description" required />
          </div>
          <div>
            <label className="block mb-2">Image URL</label>
            <Input name="imageUrl" type="url" required />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sections</h3>
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border p-4 mb-4 rounded-lg">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[sectionIndex].title = e.target.value;
                    setSections(newSections);
                  }}
                  className="mb-4"
                  required
                />

                {section.videos.map((video, videoIndex) => (
                  <div key={videoIndex} className="ml-4 mb-4">
                    <Input
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].videos[videoIndex].title =
                          e.target.value;
                        setSections(newSections);
                      }}
                      className="mb-2"
                      required
                    />
                    <Input
                      placeholder="Video URL"
                      value={video.videoUrl}
                      onChange={(e) => {
                        const newSections = [...sections];
                        newSections[sectionIndex].videos[videoIndex].videoUrl =
                          e.target.value;
                        setSections(newSections);
                      }}
                      required
                    />
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newSections = [...sections];
                    newSections[sectionIndex].videos.push({
                      title: "",
                      videoUrl: "",
                    });
                    setSections(newSections);
                  }}
                  className="mt-2"
                >
                  Add Video
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setSections([
                  ...sections,
                  { title: "", videos: [{ title: "", videoUrl: "" }] },
                ])
              }
            >
              Add Section
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
