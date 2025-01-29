// File: src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json();

  const course = await prisma.course.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      sections: {
        deleteMany: {},
        create: data.sections.map((section: any) => ({
          title: section.title,
          videoUrl: section.videoUrl,
        })),
      },
    },
  });

  return NextResponse.json(course);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        sections: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
