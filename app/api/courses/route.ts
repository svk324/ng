// File: src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const data = await req.json();

  const course = await prisma.course.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      sections: {
        create: data.sections.map((section: any) => ({
          title: section.title,
          videoUrl: section.videoUrl,
        })),
      },
    },
  });

  return NextResponse.json(course);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStudents = searchParams.get("include") === "students";

    const courses = await prisma.course.findMany({
      include: {
        students: includeStudents,
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
