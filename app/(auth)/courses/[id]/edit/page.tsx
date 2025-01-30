"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Video {
  title: string;
  videoUrl: string;
}

interface Section {
  title: string;
  videos: Video[];
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${params.id}`);
        const data = await response.json();

        // Ensure the data structure matches our interface
        const formattedCourse = {
          ...data,
          sections: data.sections.map((section: any) => ({
            title: section.title,
            videos: section.videos || [],
          })),
        };

        setCourse(formattedCourse);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      // Filter out empty sections and videos
      const validSections = course.sections
        .filter((section) => section.title.trim() !== "")
        .map((section) => ({
          ...section,
          videos: section.videos.filter(
            (video) => video.title.trim() !== "" && video.videoUrl.trim() !== ""
          ),
        }))
        .filter((section) => section.videos.length > 0);

      // Ensure there's at least one valid section with a video
      if (validSections.length === 0) {
        toast.error("At least one section with a video is required");
        return;
      }

      // Prepare the data to be updated
      const courseData = {
        title: course.title.trim(),
        description: course.description.trim(),
        imageUrl: course.imageUrl.trim(),
        sections: validSections,
      };

      // Send the update request
      const response = await fetch(`/api/courses/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update course");
      }

      toast.success("Course updated successfully");
      router.push("/courses");
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update course"
      );
    }
  };

  const addSection = () => {
    if (!course) return;
    setCourse({
      ...course,
      sections: [
        ...course.sections,
        { title: "", videos: [{ title: "", videoUrl: "" }] },
      ],
    });
  };

  const addVideo = (sectionIndex: number) => {
    if (!course) return;
    const newSections = [...course.sections];
    newSections[sectionIndex].videos.push({ title: "", videoUrl: "" });
    setCourse({
      ...course,
      sections: newSections,
    });
  };

  const updateSectionTitle = (sectionIndex: number, title: string) => {
    if (!course) return;
    const newSections = [...course.sections];
    newSections[sectionIndex].title = title;
    setCourse({
      ...course,
      sections: newSections,
    });
  };

  const updateVideo = (
    sectionIndex: number,
    videoIndex: number,
    field: "title" | "videoUrl",
    value: string
  ) => {
    if (!course) return;
    const newSections = [...course.sections];
    newSections[sectionIndex].videos[videoIndex][field] = value;
    setCourse({
      ...course,
      sections: newSections,
    });
  };

  const removeSection = (sectionIndex: number) => {
    if (!course) return;
    const newSections = [...course.sections];
    newSections.splice(sectionIndex, 1);
    setCourse({
      ...course,
      sections: newSections,
    });
  };

  const removeVideo = (sectionIndex: number, videoIndex: number) => {
    if (!course) return;
    const newSections = [...course.sections];
    newSections[sectionIndex].videos.splice(videoIndex, 1);
    setCourse({
      ...course,
      sections: newSections,
    });
  };

  if (isLoading) return <div className="container mx-auto p-6">Loading...</div>;
  if (!course)
    return <div className="container mx-auto p-6">Course not found</div>;

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

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sections</h3>
              <Button type="button" variant="outline" onClick={addSection}>
                Add Section
              </Button>
            </div>

            {course.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className="border p-4 rounded-lg space-y-4"
              >
                <div className="flex justify-between items-center gap-4">
                  <Input
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) =>
                      updateSectionTitle(sectionIndex, e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    Remove Section
                  </Button>
                </div>

                <div className="space-y-4 ml-4">
                  {section.videos.map((video, videoIndex) => (
                    <div key={videoIndex} className="flex flex-col gap-2">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            placeholder="Video Title"
                            value={video.title}
                            onChange={(e) =>
                              updateVideo(
                                sectionIndex,
                                videoIndex,
                                "title",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVideo(sectionIndex, videoIndex)}
                        >
                          Remove Video
                        </Button>
                      </div>
                      <Input
                        placeholder="Video URL"
                        value={video.videoUrl}
                        onChange={(e) =>
                          updateVideo(
                            sectionIndex,
                            videoIndex,
                            "videoUrl",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addVideo(sectionIndex)}
                  >
                    Add Video
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full">
            Update Course
          </Button>
        </form>
      </Card>
    </div>
  );
}
