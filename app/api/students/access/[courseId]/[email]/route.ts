import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; email: string } }
) {
  try {
    await prisma.studentCourse.delete({
      where: {
        studentEmail_courseId: {
          studentEmail: decodeURIComponent(params.email),
          courseId: params.courseId,
        },
      },
    });

    return NextResponse.json({ message: "Student removed successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove student" },
      { status: 500 }
    );
  }
}
