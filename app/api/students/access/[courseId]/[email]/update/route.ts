import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; email: string } }
) {
  try {
    const { newEmail, certificateUrl } = await req.json();

    const updatedStudent = await prisma.studentCourse.update({
      where: {
        studentEmail_courseId: {
          studentEmail: decodeURIComponent(params.email),
          courseId: params.courseId,
        },
      },
      data: {
        ...(newEmail && { studentEmail: newEmail }),
        ...(certificateUrl !== undefined && { certificateUrl }),
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update student" },
      { status: 500 }
    );
  }
}
