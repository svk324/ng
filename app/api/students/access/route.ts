// File: src/app/api/students/access/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { studentEmail, courseId, certificateUrl } = await req.json();

  const studentAccess = await prisma.studentCourse.create({
    data: {
      studentEmail,
      courseId,
      certificateUrl,
    },
  });

  return NextResponse.json(studentAccess);
}
