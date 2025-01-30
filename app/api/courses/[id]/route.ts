// File: src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          include: {
            videos: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Validate the incoming data
    if (
      !data ||
      !data.title ||
      !data.description ||
      !data.imageUrl ||
      !Array.isArray(data.sections)
    ) {
      return NextResponse.json(
        { error: "Invalid course data" },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.$transaction(async (tx) => {
      // Delete existing sections (cascade will delete videos)
      await tx.section.deleteMany({
        where: { courseId: id },
      });

      // Update course with new sections and videos
      return tx.course.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          sections: {
            create: data.sections
              .filter(
                (section: any) => section.title && Array.isArray(section.videos)
              )
              .map((section: any) => ({
                title: section.title,
                videos: {
                  create: section.videos
                    .filter((video: any) => video.title && video.videoUrl)
                    .map((video: any) => ({
                      title: video.title,
                      videoUrl: video.videoUrl,
                    })),
                },
              })),
          },
        },
        include: {
          sections: {
            include: {
              videos: true,
            },
          },
        },
      });
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}
